import { useState } from 'react';

export function StudioView() {
  const [testText, setTestText] = useState(
    'XID Protocol implements a recursive SNARK architecture designed specifically for institutional banking consortiums. The system operates on a zero-knowledge proof circuit where verification occurs on-chain in O(1) constant time, while private user claims remain locked in local mobile secure enclaves.'
  );
  const [chunkSize, setChunkSize] = useState(250);
  const [overlap, setOverlap] = useState(40);
  const [temperature, setTemperature] = useState(0.2);
  const [groundingThreshold, setGroundingThreshold] = useState(0.82);

  // Quick live chunk calculation
  const words = testText.split(/\s+/).filter(Boolean);
  const estimatedTokens = Math.round(words.length * 1.3);
  const numChunks = Math.max(1, Math.ceil(testText.length / (chunkSize || 1)));

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="font-telemetry-sm text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Knowledge Hub
          </div>
          <h2 className="font-headline-lg text-3xl font-extrabold text-slate-900 tracking-tight">
            Knowledge &amp; AI Settings
          </h2>
          <span className="text-xs font-telemetry-sm text-slate-500">
            Configure document processing, knowledge indexing, and AI research parameters
          </span>
        </div>
        <div className="mt-3 md:mt-0 font-telemetry-sm text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 font-bold">
          Knowledge Base: Active
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Chroma Shard Telemetry & Parameters */}
        <div className="lg:col-span-5 space-y-6">
          {/* Shard Status Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-headline-sm text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-cyan-600">storage</span>
                Knowledge Index Status
              </h4>
              <span className="text-[10px] font-telemetry-sm bg-cyan-50 text-cyan-700 border border-cyan-200 px-2 py-0.5 rounded font-bold">
                Ready
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-telemetry-sm">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 block text-[10px]">Total Vector Chunks:</span>
                <span className="font-bold text-slate-900 text-lg">1,842</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 block text-[10px]">Distance Metric:</span>
                <span className="font-bold text-indigo-700 text-lg">Cosine</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 block text-[10px]">Avg Index Latency:</span>
                <span className="font-bold text-emerald-700 text-lg">4.2ms</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 block text-[10px]">Grounding Rate:</span>
                <span className="font-bold text-cyan-700 text-lg">99.4%</span>
              </div>
            </div>
          </div>

          {/* Hyperparameter Sliders */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h4 className="font-headline-sm text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-indigo-600">tune</span>
              AI Analysis Controls
            </h4>

            {/* Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-telemetry-sm">
                <span className="text-slate-600 font-semibold">Creativity vs. Precision:</span>
                <span className="font-bold text-indigo-600">{temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <span className="text-[10px] text-slate-400 block">
                Lower values ensure strict adherence to factual documentation.
              </span>
            </div>

            {/* Grounding Threshold */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-telemetry-sm">
                <span className="text-slate-600 font-semibold">Web Research Sensitivity:</span>
                <span className="font-bold text-cyan-700">{groundingThreshold}</span>
              </div>
              <input
                type="range"
                min="0.50"
                max="0.95"
                step="0.01"
                value={groundingThreshold}
                onChange={(e) => setGroundingThreshold(parseFloat(e.target.value))}
                className="w-full accent-cyan-600"
              />
              <span className="text-[10px] text-slate-400 block">
                Triggers live web verification when document confidence is below {Math.round(groundingThreshold * 100)}%.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Ingestion Chunker Sandbox */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-headline-sm text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-emerald-600">content_cut</span>
                Document Chunking &amp; Tokenization Sandbox
              </h4>
              <div className="flex items-center gap-2 text-xs font-telemetry-sm text-slate-500">
                <span>Tokens: ~{estimatedTokens}</span>
                <span>•</span>
                <span>Chunks: {numChunks}</span>
              </div>
            </div>

            {/* Textarea */}
            <div>
              <label htmlFor="test-doc" className="text-xs font-bold font-telemetry-sm text-slate-700 block mb-1 uppercase tracking-wider">
                Source Document Text:
              </label>
              <textarea
                id="test-doc"
                rows={5}
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-none"
              />
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-telemetry-sm text-slate-600 font-semibold block mb-1">
                  Target Chunk Size (Chars): {chunkSize}
                </label>
                <input
                  type="range"
                  min="100"
                  max="800"
                  step="25"
                  value={chunkSize}
                  onChange={(e) => setChunkSize(parseInt(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-telemetry-sm text-slate-600 font-semibold block mb-1">
                  Overlap (Chars): {overlap}
                </label>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="10"
                  value={overlap}
                  onChange={(e) => setOverlap(parseInt(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>

            {/* Chunk Previews */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-telemetry-sm font-bold text-slate-700 uppercase tracking-wide block">
                Document Segments Preview:
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {Array.from({ length: numChunks }).map((_, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700">
                    <span className="text-indigo-600 font-bold block mb-1">[chunk_sim_{String(i + 1).padStart(3, '0')}]</span>
                    <p className="line-clamp-2">
                      {testText.slice(i * (chunkSize - overlap), i * (chunkSize - overlap) + chunkSize)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
