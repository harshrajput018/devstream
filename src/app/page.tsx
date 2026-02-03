'use client';
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, Terminal, Zap, Search, 
  ChevronRight, Github, Bug, ShieldCheck,
  Menu, X
} from 'lucide-react';

export default function DevStreamPro() {
  const [code, setCode] = useState('// Paste your code here to audit...');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleAudit = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setReport(data);
    } catch (err) {
      console.error("Audit failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-300 font-mono selection:bg-emerald-500/30">
      {/* HEADER: Responsive padding */}
      <nav className="border-b border-white/5 bg-[#0d0d0f]/80 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 py-4">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <ShieldAlert className="text-emerald-500" size={20} />
            </div>
            <h1 className="text-lg font-black tracking-tighter text-white">DEVSTREAM <span className="text-emerald-500">PRO</span></h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span className="hover:text-emerald-500 cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-emerald-500 cursor-pointer transition-colors">Security Engine v2.5</span>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT: flex-col for mobile, flex-row for desktop */}
      <main className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-65px)] overflow-y-auto lg:overflow-hidden">
        
        {/* EDITOR SECTION */}
        <section className="flex-1 flex flex-col border-r border-white/5 bg-[#0d0d0f]">
          <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <Terminal size={14} /> main_source.tsx
            </div>
            <button 
              onClick={handleAudit}
              disabled={isAnalyzing}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white rounded-md text-[11px] font-black transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20"
            >
              {isAnalyzing ? <Zap className="animate-spin" size={12} /> : <Search size={12} />}
              {isAnalyzing ? 'AUDITING...' : 'RUN SECURITY AUDIT'}
            </button>
          </div>
          <div className="h-[400px] lg:h-full">
            <Editor
              height="100%"
              defaultLanguage="typescript"
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || '')}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                padding: { top: 20 },
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </section>

        {/* RESULTS SECTION: Stacks on mobile */}
        <aside className="w-full lg:w-[400px] xl:w-[450px] bg-[#0a0a0c] border-t lg:border-t-0 border-white/5 overflow-y-auto">
          {report ? (
            <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 lg:slide-in-from-right-4">
              <div className="space-y-4">
                <h3 className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em]">Audit Summary</h3>
                <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-sm leading-relaxed text-emerald-100/80 italic">
                  "{report.summary}"
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Critical Findings</h3>
                <div className="space-y-4">
                  {report.reviews?.map((issue: any, i: number) => (
                    <div key={i} className="group p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 uppercase tracking-tighter">
                          Line {issue.line}
                        </span>
                        <Bug size={14} className="text-slate-600 group-hover:text-emerald-500" />
                      </div>
                      <p className="text-[13px] font-bold text-slate-200 mb-2">{issue.label}</p>
                      <p className="text-[12px] leading-relaxed text-slate-500">{issue.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="min-h-[200px] lg:h-full flex flex-col items-center justify-center p-8 text-center space-y-4 opacity-30">
              <ShieldCheck size={48} strokeWidth={1} />
              <p className="text-xs font-bold uppercase tracking-widest">Awaiting Code Submission</p>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
