# PitchVane 🎯

> **Autonomous AI Due Diligence & Investment Committee War Room**

PitchVane is an institutional-grade, multi-agent due diligence platform for venture funds, angels, and founders. It orchestrates autonomous AI specialist agents to evaluate startup pitches, verify grounding with real-time web telemetry, stress-test defensibility, and synthesize investment memos in real-time.

---

## ⚡ Core Architecture

- **Autonomous Agent Swarm**:
  - **Agent 01 · Market Analyst**: TAM/SAM estimation, CAGR dynamics, customer urgency.
  - **Agent 02 · Competitor Scout**: Incumbent intelligence, moat durability, workflow lock-in.
  - **Agent 03 · Financial Modeler**: Unit economics, payback periods, gross margin viability.
  - **Agent 04 · Risk Assessor**: Regulatory exposure, execution bottlenecks, downside audit.
- **Dual-Pass Grounding**: Real-time web retrieval via Tavily + Vector RAG to eliminate hallucinations.
- **Interactive Due Diligence War Room**: Streaming telemetry, dynamic debate tabs, and PDF exportable memos.
- **Authentication & Security**: Google OAuth 2.0 & JWT enterprise RBAC.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local MongoDB instance

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your GROQ_API_KEY, TAVILY_API_KEY, and MONGODB_URI
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Fill in your VITE_GOOGLE_CLIENT_ID
npm run dev
```

Visit `http://localhost:5173` to launch the War Room.

---

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express, LangGraph / LangChain, Socket.io
- **AI & RAG**: Groq (Llama-3), Tavily API, Vector Store Grounding
- **Database**: MongoDB with Mongoose
