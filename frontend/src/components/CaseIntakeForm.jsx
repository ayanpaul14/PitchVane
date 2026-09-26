import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Paperclip,
  X,
  Bot,
  User,
  Sparkles,
  Rocket,
  Loader2,
  FileText,
  AlertCircle,
  Inbox,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Layers,
  HelpCircle,
} from 'lucide-react';

const PRESET_CASES = [
  {
    name: 'CargoPulse Logistics',
    label: '🚀 Load CargoPulse Demo Deck',
    category: 'Seed Extension ($2.8M at $14M Cap) · Supply Chain & Fleet Intelligence',
    text: 'Company: CargoPulse Intelligent Logistics\nStage: Seed Extension ($2.8M at $14M Cap)\nSector: Supply Chain & Cold-Chain Fleet Intelligence\n\nExecutive Summary:\nCargoPulse is an automated IoT + AI telemetry platform for pharmaceutical and perishables freight. It integrates directly with reefer trailers to predict temperature excursions 4 hours before they happen, automatically rerouting shipments and filing automated insurance claims.\n\nKey Metrics & Traction:\n- Current ARR: $820K across 19 regional freight carriers and 2 national pharma distributors\n- Customer Acquisition Cost (CAC): $14,200 / Customer Lifetime Value (LTV): $118,000 (LTV/CAC = 8.3x)\n- Churn: 0% net churn over trailing 12 months\n- Average Contract Value (ACV): $43,000/yr on 2-year upfront contracts\n- Unit Economics: Sensor hardware paid back in Month 2; 82% SaaS gross margin',
  },
  {
    name: 'OmniHealth AI',
    label: '💡 Telehealth & Remote Monitoring ($4M Series A)',
    category: 'Series A ($4M at $22M Cap) · AI Clinical Telemetry',
    text: 'Company: OmniHealth AI\nStage: Series A ($4M at $22M Cap)\nSector: AI Clinical Telemetry & Remote Patient Monitoring\n\nExecutive Summary:\nOmniHealth integrates non-invasive wearable sensors with hospital EHRs to continuously track post-operative vital signs, reducing 30-day readmissions by 38% for cardiology departments.\n\nKey Metrics & Traction:\n- ARR: $1.4M with 3 health system pilots converting to enterprise contracts\n- MoM Growth: 14% over past 6 months\n- Gross Margin: 78%',
  },
];

const ACCEPTED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

const MAX_FILE_SIZE_MB = 20;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CaseIntakeForm({ onSubmit, loading }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "👋 Welcome! I'm your **Pitchvane AI Diligence Copilot**.\n\nTell me about the startup you're evaluating or upload a pitch deck. Once ready, I'll coordinate our 4 specialist agents (**Market Analyst**, **Competitor Scout**, **Financial Modeler**, and **Risk Assessor**) to generate a comprehensive 18-page investment committee memo in under 120 seconds.",
      timestamp: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [preparedText, setPreparedText] = useState('');

  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const addFiles = useCallback((incoming) => {
    setFileError('');
    const valid = [];
    for (const f of incoming) {
      if (!ACCEPTED_TYPES.includes(f.type)) {
        setFileError(`"${f.name}" is not a supported file format.`);
        continue;
      }
      if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setFileError(`"${f.name}" exceeds ${MAX_FILE_SIZE_MB}MB.`);
        continue;
      }
      if (!files.find((x) => x.name === f.name)) {
        valid.push(f);
      }
    }
    if (valid.length > 0) {
      setFiles((prev) => [...prev, ...valid]);
    }
  }, [files]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  }, [addFiles]);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const handleFileInput = (e) => {
    addFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const removeFile = (name) => setFiles((prev) => prev.filter((f) => f.name !== name));

  const handleSendMessage = (textToSend = inputVal, attachedFiles = files) => {
    const text = textToSend.trim();
    if (!text && attachedFiles.length === 0) return;

    const userMsgId = `user-${Date.now()}`;
    const newMsg = {
      id: userMsgId,
      sender: 'user',
      text: text || `Uploaded ${attachedFiles.length} file(s) for diligence.`,
      files: [...attachedFiles],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');
    const currentPrepared = text || preparedText;
    setPreparedText(currentPrepared);

    // Bot response simulation
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const isPitchText = text.length >= 10;
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: isPitchText
            ? `✅ **Case Intake Configured!**\n\nI've parsed the startup details (${text.slice(0, 80)}...). All 4 specialist agents are standing by on live data stream. Click **"Launch Live Diligence"** below or in the input bar to begin the parallel synthesis.`
            : `Please provide at least 10 characters describing the startup or load one of the 1-click sample cases below so our agents have sufficient ground data.`,
          isActionable: isPitchText,
          caseIdea: text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleApplyPreset = (preset) => {
    setPreparedText(preset.text);
    handleSendMessage(preset.text, files);
  };

  const handleLaunchAnalysis = (ideaToRun) => {
    const targetIdea = ideaToRun || preparedText || inputVal;
    if (targetIdea.trim().length >= 10 && !loading) {
      onSubmit(targetIdea, files);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: "👋 Chat reset. Paste a startup summary or deck notes to begin a fresh due diligence case.",
        timestamp: 'Just now',
      },
    ]);
    setInputVal('');
    setFiles([]);
    setPreparedText('');
  };

  return (
    <section id="intake-section" className="space-y-3 sm:space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 dark:border-white/10 pb-3 gap-2">
        <div>
          <div className="font-telemetry-sm text-[10px] sm:text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-0.5 sm:mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span> AI Diligence Copilot
          </div>
          <h2 className="font-headline-lg text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Initiate Due Diligence Pipeline
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetChat}
            className="text-[11px] font-telemetry-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset conversation"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Main Chatbot Container */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`bg-white dark:bg-[#060b19] border rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden flex flex-col transition-all duration-200 relative ${
          dragging
            ? 'border-cyan-500 ring-4 ring-cyan-500/20 bg-cyan-50/20 dark:bg-cyan-950/20'
            : 'border-slate-200 dark:border-white/10'
        }`}
        style={{ minHeight: 'min(480px, 75svh)' }}
      >
        {/* Chatbot Top Navigation Status Bar */}
        <div className="px-3.5 sm:px-5 py-2.5 sm:py-3.5 bg-slate-50/90 dark:bg-black/40 border-b border-slate-200 dark:border-white/10 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 dark:from-cyan-500 dark:to-orange-500 flex items-center justify-center text-white shadow-sm">
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-headline-sm text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Pitchvane Diligence Assistant
                </span>
                <span className="font-telemetry-sm text-[9px] font-bold bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30 px-1.5 sm:px-2 py-0.2 rounded-full">
                  4 Agents
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Interactive intake & automated synthesis
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-telemetry-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-cyan-500" /> Web Grounded
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-500 dark:text-orange-400" /> Dual-Pass Audit
            </span>
          </div>
        </div>

        {/* Drag Overlay Feedback */}
        {dragging && (
          <div className="absolute inset-0 bg-cyan-900/40 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-white border-2 border-dashed border-cyan-400 m-3 rounded-2xl pointer-events-none">
            <Inbox className="w-12 h-12 text-cyan-300 animate-bounce mb-2" />
            <p className="text-sm font-bold">Drop deck or financial docs here</p>
            <p className="text-xs text-cyan-200">PDF, DOCX, PPTX, PNG up to 20MB</p>
          </div>
        )}

        {/* Chat Messages Feed */}
        <div
          ref={chatContainerRef}
          className="flex-1 p-3 sm:p-5 md:p-6 overflow-y-auto space-y-3 sm:space-y-4 max-h-[46svh] sm:max-h-[420px] bg-slate-50/40 dark:bg-[#040814]/50"
        >
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-2 sm:gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                )}

                <div className={`max-w-[86vw] sm:max-w-xl space-y-1.5 sm:space-y-2 ${isBot ? 'text-left' : 'text-right'}`}>
                  <div
                    className={`p-3 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      isBot
                        ? 'bg-white dark:bg-[#0c1329] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 shadow-sm'
                        : 'bg-gradient-to-r from-cyan-600 via-indigo-600 to-indigo-700 dark:from-cyan-500 dark:to-orange-500 text-white shadow-md'
                    }`}
                  >
                    {msg.text}

                    {/* Attached files preview inside user bubble */}
                    {msg.files && msg.files.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-white/20 flex flex-wrap gap-1.5 justify-end">
                        {msg.files.map((f, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/20 text-[10px] sm:text-[11px] font-telemetry-sm font-medium"
                          >
                            <FileText className="w-3 h-3 text-cyan-200" />
                            <span className="truncate max-w-[120px]">{f.name}</span>
                            <span className="opacity-70 text-[9px]">({formatBytes(f.size)})</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action button inside bot message if ready to launch */}
                    {msg.isActionable && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row gap-2">
                        <motion.button
                          type="button"
                          onClick={() => handleLaunchAnalysis(msg.caseIdea)}
                          disabled={loading}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 dark:from-cyan-500 dark:to-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-105 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Running 4-Agent Diligence...</span>
                            </>
                          ) : (
                            <>
                              <Rocket className="w-3.5 h-3.5" />
                              <span>Launch 4-Agent Diligence (120s)</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] font-telemetry-sm text-slate-400 dark:text-slate-500 px-1 block">
                    {msg.timestamp}
                  </span>
                </div>

                {!isBot && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-100 dark:bg-white/10 border border-indigo-200 dark:border-white/20 flex items-center justify-center text-indigo-700 dark:text-slate-200 shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500 shrink-0">
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="p-2.5 sm:p-3 bg-white dark:bg-[#0c1329] border border-slate-200 dark:border-white/10 rounded-2xl flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.15s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.3s]"></span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 sm:px-5 py-2 sm:py-2.5 bg-slate-50 dark:bg-[#050814] border-t border-slate-200 dark:border-white/10 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar text-xs shrink-0">
          <span className="font-telemetry-sm text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-500" /> Demos:
          </span>
          {PRESET_CASES.map((preset, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="px-2.5 sm:px-3 py-1 rounded-full bg-white dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-cyan-950/40 border border-slate-200 dark:border-white/10 hover:border-cyan-400/40 text-slate-700 dark:text-slate-300 text-[10px] sm:text-[11px] font-medium whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer shadow-2xs shrink-0"
            >
              <span>{preset.label}</span>
            </button>
          ))}
        </div>

        {/* Attached Files Chips Bar */}
        {files.length > 0 && (
          <div className="px-3 sm:px-5 py-1.5 sm:py-2 bg-slate-100 dark:bg-[#080e22] border-t border-slate-200 dark:border-white/10 flex flex-wrap gap-1.5 sm:gap-2 items-center">
            <span className="text-[10px] font-telemetry-sm font-bold text-slate-500 dark:text-slate-400 uppercase">
              Attached ({files.length}):
            </span>
            {files.map((file) => (
              <div
                key={file.name}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/15 rounded-lg text-xs text-slate-800 dark:text-slate-200"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span className="truncate max-w-[110px] sm:max-w-[130px]">{file.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">({formatBytes(file.size)})</span>
                <button
                  type="button"
                  onClick={() => removeFile(file.name)}
                  className="text-slate-400 hover:text-rose-500 ml-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* File Error Notification */}
        {fileError && (
          <div className="px-4 py-1.5 bg-rose-50 dark:bg-rose-950/40 border-t border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>{fileError}</span>
          </div>
        )}

        {/* Interactive Chat Input Area */}
        <div className="p-2.5 sm:p-4 bg-white dark:bg-[#060b19] border-t border-slate-200 dark:border-white/10">
          <div className="relative flex items-end gap-1.5 sm:gap-2 bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/15 rounded-2xl p-1.5 sm:p-2 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
            {/* Upload Paperclip Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 sm:p-2.5 rounded-xl text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="Attach PDF deck or docs"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.txt,.ppt,.pptx"
              onChange={handleFileInput}
              className="hidden"
            />

            {/* Chat Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question, paste deck notes, or describe startup..."
              className="min-w-0 flex-1 bg-transparent border-none p-1.5 sm:p-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none font-sans max-h-32"
            />

            {/* Action Buttons: Chat Send or Direct Launch */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {/* If prepared text is ready, show quick launch rocket */}
              {(preparedText || inputVal.trim().length >= 10) && (
                <button
                  type="button"
                  onClick={() => handleLaunchAnalysis(inputVal || preparedText)}
                  disabled={loading}
                  className="px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 dark:from-cyan-500 dark:to-orange-500 text-white font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-md flex items-center gap-1 sm:gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Launch 4-Agent Diligence Pipeline"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Rocket className="w-3.5 h-3.5 text-cyan-200" />
                      <span className="hidden sm:inline">Launch</span>
                    </>
                  )}
                </button>
              )}

              {/* Chat Send Button */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputVal.trim() && files.length === 0}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/20 text-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Send message"
              >
                <Send className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </div>

          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between text-[10px] sm:text-[11px] font-telemetry-sm text-slate-400 dark:text-slate-500 mt-1.5 sm:mt-2 px-1 gap-0.5">
            <span className="leading-relaxed">
              💡 <strong>Tip:</strong> Press <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-white/10 font-mono text-[9px] sm:text-[10px]">Enter</kbd> to chat or click <strong>Launch</strong> to run the memo.
            </span>
            <span className="hidden sm:inline shrink-0">PDF, DOCX, PPTX (max 20MB)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
