# Pitchvane — System Design & Implementation Plan

---

## PART 1 — SYSTEM DESIGN

### 1.1 High-Level Architecture

```
┌─────────────────────┐        HTTP (POST /api/cases)       ┌──────────────────────────┐
│                      │ ───────────────────────────────────▶│                          │
│   Frontend (React)   │                                       │   Backend (Express +     │
│   Vite + Tailwind    │◀───────────────────────────────────  │   Socket.IO)             │
│   Socket.IO client   │      WebSocket (agent:*, report:*)   │                          │
└─────────────────────┘                                       └────────────┬─────────────┘
                                                                             │
                                     ┌───────────────────────────────────────┼───────────────────────────────┐
                                     │                                       │                               │
                              ┌──────▼───────┐                    ┌──────────▼──────────┐            ┌───────▼────────┐
                              │  LangGraph    │                    │   Chroma (vector DB) │            │  MongoDB Atlas │
                              │  Orchestrator │◀──retrieve()───────│   embedded chunks    │            │  case records  │
                              │  (4 agents +  │                    └──────────────────────┘            └────────────────┘
                              │  synthesizer) │
                              └──────┬────────┘
                                     │
                        ┌────────────┼─────────────┐
                        │                           │
                 ┌──────▼──────┐            ┌───────▼───────┐
                 │  Groq API   │            │  Tavily API   │
                 │  (LLaMA     │            │  (live search │
                 │  3.3-70B)   │            │  fallback)    │
                 └─────────────┘            └───────────────┘
```

**Request lifecycle, in one line:** user submits an idea → backend creates a case record → LangGraph fires 4 research agents in parallel, each retrieving from Chroma (or falling back to Tavily on low confidence) → each agent's structured finding streams to the frontend live via Socket.IO → once all 4 finish, a Synthesizer node reconciles them into a verdict → the verdict is persisted and streamed as `report:ready`.

---

### 1.2 Component Breakdown

| Component | Responsibility | Tech |
|---|---|---|
| **Frontend** | Case intake form, live agent status view, final dossier view | React, Vite, Tailwind, Socket.IO client, Recharts, lucide-react |
| **API layer** | REST endpoints for case creation/retrieval | Express |
| **Real-time layer** | Streams agent progress events to the client | Socket.IO |
| **Orchestrator** | Defines agent graph, runs nodes in parallel, fans in to synthesizer | LangGraph.js (`@langchain/langgraph`) |
| **Agents (x4)** | Plan sub-questions → retrieve → reason → emit structured JSON finding | Groq SDK (LLaMA 3.3-70B) |
| **Synthesizer** | Reconciles 4 findings into agreements/contradictions + final verdict | Groq SDK |
| **RAG layer** | Chunking, embedding, similarity search, metadata filtering | Chroma + `@xenova/transformers` |
| **Live search fallback** | Used when retrieval similarity < threshold | Tavily API |
| **Guardrails layer** | Verifies cited evidence chunk IDs actually exist; flags low-confidence findings | Custom validation logic in agent loop |
| **Persistence** | Stores case, findings, verdict | MongoDB Atlas (Mongoose) |
| **Ingestion** | One-off script: load seed docs → chunk → embed → push to Chroma | Standalone Node script |

---

### 1.3 Data Model (MongoDB)

**`Case` collection**
```js
{
  _id: ObjectId,
  idea: String,                  // the raw startup idea text
  status: "pending" | "running" | "done" | "failed",
  findings: {
    market:     { finding, confidence, evidence: [chunkId], verdictTag },
    competitor: { finding, confidence, evidence: [chunkId], verdictTag },
    financial:  { finding, confidence, evidence: [chunkId], verdictTag },
    risk:       { finding, confidence, evidence: [chunkId], verdictTag }
  },
  debatePoints: [
    { topic: String, agreement: Boolean, agentsInvolved: [String], note: String }
  ],
  verdict: {
    score: Number,               // 0–10
    recommendation: String,
    reasoning: String
  },
  metrics: {
    retrievalRelevanceAvg: Number,
    fallbackRate: Number,
    latencyMs: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Chroma collection** (per chunk)
```json
{
  "id": "chunk_0193",
  "embedding": [ /* vector */ ],
  "document": "raw chunk text",
  "metadata": { "source": "market_report_2025.pdf", "category": "market" }
}
```

---

### 1.4 LangGraph State Shape

```js
{
  caseId: String,
  idea: String,
  findings: { market: null, competitor: null, financial: null, risk: null },
  debatePoints: [],
  verdict: null
}
```

**Graph shape:**
```
        ┌────────────────┐
 idea ─▶│  4 parallel     │─▶ fan-in ─▶ Synthesizer ─▶ verdict
        │  research nodes │
        └────────────────┘
```
Each research node runs the same internal loop (plan sub-questions → retrieve/fallback → structured reasoning call), differing only in prompt and Chroma metadata filter (`category: "market" | "competitor" | "financial" | "risk"`).

---

### 1.5 Socket.IO Event Contract

| Event | Payload | When |
|---|---|---|
| `agent:start` | `{ caseId, agent }` | A research node begins |
| `agent:step` | `{ caseId, agent, step, detail }` | Sub-question planned / retrieval done / fallback triggered |
| `agent:done` | `{ caseId, agent, finding }` | Node finishes, structured finding emitted |
| `synthesis:point` | `{ caseId, topic, agreement, note }` | Synthesizer identifies an agreement/contradiction |
| `report:ready` | `{ caseId, verdict }` | Final verdict persisted |
| `case:error` | `{ caseId, stage, message }` | Any node fails (timeout, rate limit, retrieval failure) |

Frontend subscribes to a room keyed by `caseId` on submission so multiple cases (if ever run concurrently) don't cross-talk.

---

### 1.6 Guardrail & Evaluation Design (Phase 4 detail)

1. **Groundedness check** — after each agent's reasoning call returns `evidence: [chunkId, ...]`, cross-check every ID against the chunk IDs actually retrieved for that sub-question. Any ID not in that set → reject the response and retry the reasoning call once with an explicit correction instruction; if it fails twice, mark `confidence: "low"` and flag `groundingFailed: true`.
2. **Confidence gating** — the frontend must visually distinguish `low` confidence findings (e.g. muted styling, a warning icon) rather than presenting all four agents as equally certain.
3. **Eval harness** — a separate script (`/ingestion/eval/run_eval.js` or similar) that loops over a fixed set of 15–20 sample ideas, runs them through the full graph, and logs: retrieval relevance (manual 1–5 score against expected concerns), fallback-trigger rate, and per-agent latency, into a markdown/CSV report.

---

### 1.7 API Surface

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/api/cases` | Create a case, kicks off the graph run, returns `{ caseId }` immediately (async) |
| `GET` | `/api/cases/:id` | Poll case status/findings (fallback if socket missed) |
| `GET` | `/api/cases/:id/report` | Fetch the final dossier once `status: "done"` |
| `GET` | `/api/cases` | List past cases (for a history view, optional) |

---

## PART 2 — IMPLEMENTATION PLAN

This maps directly onto the 6 phases already agreed, but adds concrete file-level tasks and checkpoints per phase.

### Phase 0 — Setup ✅ (in progress)
- [x] Groq + Tavily keys
- [ ] MongoDB Atlas cluster + connection string
- [ ] Repo structure (`frontend/`, `backend/`, `ingestion/`)
- [ ] Backend deps installed (`@langchain/langgraph`, `@langchain/core`, `groq-sdk`, `chromadb`, `express`, `socket.io`, `mongoose`, `dotenv`)
- [ ] Frontend deps installed (Vite + React, Tailwind v4 via `@tailwindcss/vite`, `socket.io-client`, `recharts`, `lucide-react`)
- [ ] `/health` endpoint returns 200, frontend can fetch it

### Phase 1 — RAG Foundation
1. `ingestion/loadDocs.js` — reads seed PDFs/text files from a local `/ingestion/data` folder.
2. `ingestion/chunk.js` — recursive splitter, ~500 tokens / 50 overlap.
3. `ingestion/embed.js` — runs each chunk through `@xenova/transformers` (`Xenova/all-MiniLM-L6-v2` or similar).
4. `ingestion/pushToChroma.js` — writes chunks + embeddings + metadata (`source`, `category`) into a local/persistent Chroma collection.
5. `ingestion/testRetrieve.js` — standalone script: takes a query string + category, prints top-k chunks. **Manually verify relevance before moving on — do not skip this.**

**Checkpoint:** you can run one command and get back plausible chunks for a test query.

### Phase 2 — Single Agent End-to-End
1. `backend/agents/marketAnalyst.js` — implements the loop: plan sub-questions (Groq call) → retrieve per sub-question (Chroma, category-filtered) → fallback to Tavily if similarity < threshold → final reasoning call forced into the JSON schema.
2. Define the shared JSON schema once in `backend/agents/schema.js` so all 4 agents use the same shape.
3. `backend/scripts/testAgent.js` — CLI script: pass an idea string, print the Market Analyst's structured output. Run against 3–4 sample ideas, including XID.

**Checkpoint:** one script, one agent, reliable structured JSON output every run.

### Phase 3 — Multi-Agent Orchestration
1. Copy the Market Analyst pattern into `competitorScout.js`, `financialModeler.js`, `riskAssessor.js` — same loop, different prompt + category filter.
2. `backend/graph/pitchvaneGraph.js` — define LangGraph state, wire 4 nodes to run in parallel, fan into `synthesizer.js`.
3. `backend/agents/synthesizer.js` — prompt takes all 4 findings, must output agreements, contradictions, and a final `{ score, recommendation }`.
4. Wire Socket.IO emission at each stage inside the graph node wrappers (not inside the agents themselves — keep agents transport-agnostic).
5. `backend/scripts/testSocket.js` — a bare socket listener script to confirm events fire correctly before any frontend work.

**Checkpoint:** `POST /api/cases` triggers all 4 agents in parallel, events stream correctly, a verdict comes out the other end — verified via script, no UI needed yet.

### Phase 4 — Guardrails & Evaluation
1. Add groundedness check as a shared helper (`backend/agents/verifyGrounding.js`) called after every agent's reasoning step.
2. Add `confidence: "low"` flagging logic + `groundingFailed` field.
3. Build the eval set — a JSON/markdown file of 15–20 ideas with expected-concerns notes.
4. `ingestion/eval/runEval.js` — loops the eval set through the graph, logs relevance/fallback-rate/latency to a report file.

**Checkpoint:** a markdown/CSV eval report you can literally open and read in an interview.

### Phase 5 — Frontend Integration
1. Case intake form → `POST /api/cases`.
2. Agent Workspace view → real Socket.IO listeners replacing any mocked `setTimeout` simulation.
3. Dossier view → `GET /api/cases/:id/report`.
4. Error/loading states: agent timeout, retrieval failure, rate-limit hit — each needs a distinct UI state, not a generic spinner.

**Checkpoint:** full flow works end-to-end from the browser.

### Phase 6 — Demo, Docs, Interview Prep
1. Run XID through the finished system — this is your headline demo.
2. Record a 2–3 min demo video.
3. Deploy: frontend → Vercel, backend → Render, Chroma → persistent volume alongside backend.
4. Write README: problem, architecture diagram (reuse §1.1 above), tech stack, local run instructions, eval results.
5. Prepare the interview narrative (problem → what you built → what you learned → honest limitations).

---

## PART 3 — SUGGESTED FOLDER STRUCTURE (target end-state)

```
PitchVane/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CaseIntakeForm.jsx
│   │   │   ├── AgentWorkspace.jsx
│   │   │   ├── AgentCard.jsx
│   │   │   └── DossierView.jsx
│   │   ├── hooks/
│   │   │   └── useCaseSocket.js
│   │   └── App.jsx
│   └── vite.config.js
├── backend/
│   ├── agents/
│   │   ├── schema.js
│   │   ├── marketAnalyst.js
│   │   ├── competitorScout.js
│   │   ├── financialModeler.js
│   │   ├── riskAssessor.js
│   │   ├── synthesizer.js
│   │   └── verifyGrounding.js
│   ├── graph/
│   │   └── pitchvaneGraph.js
│   ├── rag/
│   │   ├── retrieve.js
│   │   └── tavilyFallback.js
│   ├── routes/
│   │   └── cases.js
│   ├── models/
│   │   └── Case.js
│   ├── scripts/
│   │   ├── testAgent.js
│   │   └── testSocket.js
│   ├── config/
│   │   └── db.js
│   └── server.js
└── ingestion/
    ├── data/                    # seed PDFs/text
    ├── loadDocs.js
    ├── chunk.js
    ├── embed.js
    ├── pushToChroma.js
    ├── testRetrieve.js
    └── eval/
        ├── evalSet.json
        └── runEval.js
```

---

*This plan should be read alongside the original 8-week phase plan — this document adds the concrete architecture and file-level breakdown underneath each phase.*
