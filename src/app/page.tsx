"use client";
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Sparkles, Code2, ShieldAlert, Zap, Terminal, LayoutPanelLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DevStream() {
  const [code, setCode] = useState("// Paste messy code here...");
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setReview(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-blue-500/30">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e1b4b,transparent_70%)] opacity-20 pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 bg-black/50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-violet-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <Code2 size={22} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
              DEVSTREAM <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-blue-400 border border-white/5">PRO AI</span>
            </h1>
          </div>
        </div>
        
        <button 
          onClick={handleReview}
          disabled={loading}
          className="relative group overflow-hidden bg-white text-black px-8 py-2.5 rounded-full font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <span className="relative z-10 flex items-center gap-2 text-sm">
            {loading ? "ANAYLZING..." : <><Zap size={16} fill="black" /> RUN REVIEW</>}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </nav>

      <main className="flex h-[calc(100vh-76px)] relative z-10">
        {/* Editor Section */}
        <div className="flex-1 p-4">
          <div className="h-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-[#0d0d0d]">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-black/40 text-[11px] font-mono tracking-widest uppercase text-slate-500">
              <Terminal size={12} /> main_module.ts
            </div>
            <Editor
              height="100%"
              defaultLanguage="typescript"
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || "")}
              options={{ 
  fontSize: 15, 
  minimap: { enabled: false },
  padding: { top: 20 },
  lineNumbersMinChars: 3
}}
            />
          </div>
        </div>

        {/* Feedback Sidebar */}
        <div className="w-[450px] p-4 flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 flex flex-col bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-white/5 bg-white/[0.02]">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-tighter">
                <LayoutPanelLeft size={18} className="text-blue-400" /> Analysis Report
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              <AnimatePresence mode="wait">
                {!review && !loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/5 rounded-xl">
                    <Sparkles size={40} className="text-slate-700 mb-4" />
                    <p className="text-sm text-slate-500">Paste your code and trigger the AI to see security and logic insights.</p>
                  </motion.div>
                )}

                {loading && (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-24 bg-white/5 animate-pulse rounded-xl" />
                    ))}
                  </div>
                )}

                {review && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                       <p className="text-xs font-semibold text-blue-400 uppercase mb-2 tracking-widest">Summary</p>
                       <p className="text-sm text-blue-100/80 leading-relaxed">{review.summary}</p>
                    </div>
                    
                    {review.reviews?.map((r: any, i: number) => (
                      <div key={i} className="group p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-white/5 rounded border border-white/5 text-slate-400 uppercase tracking-widest">Line {r.line}</span>
                          <ShieldAlert size={14} className="text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[13px] text-slate-300 leading-relaxed italic border-l-2 border-blue-500/30 pl-3">
                          {r.suggestion}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .monaco-editor, .overflow-guard { border-radius: 12px !important; }
      `}</style>
    </div>
  );
}
