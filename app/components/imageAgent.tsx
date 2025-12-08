"use client";

import useSWR from "swr";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";

// --- CUSTOM HOOK ---
const useTypewriter = (text: string, speed: number = 20) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    if (!text) { setDisplayedText(""); return; }
    setDisplayedText(""); 
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(intervalId);
    }, speed);
    return () => clearInterval(intervalId);
  }, [text, speed]);
  return displayedText;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// --- THEME HELPER ---
const getTheme = (level: string) => {
    const normalizedLevel = level?.toLowerCase() || "";
    
    if (normalizedLevel.includes("high") || normalizedLevel.includes("critical")) {
        return {
            color: "text-red-500",
            border: "border-red-500/50",
            bg: "bg-red-500/10",
            glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]",
            bar: "bg-red-500",
            button: "hover:bg-red-500/20 border-red-500/40 text-red-500",
            status: "CRITICAL"
        };
    } else if (normalizedLevel.includes("medium") || normalizedLevel.includes("moderate")) {
        return {
            color: "text-amber-400",
            border: "border-amber-400/50",
            bg: "bg-amber-400/10",
            glow: "shadow-[0_0_15px_rgba(251,191,36,0.15)]",
            bar: "bg-amber-400",
            button: "hover:bg-amber-400/20 border-amber-400/40 text-amber-400",
            status: "WARNING"
        };
    } else {
        return {
            color: "text-[#00ffa2]",
            border: "border-[#00ffa2]/50",
            bg: "bg-[#00ffa2]/10",
            glow: "shadow-[0_0_15px_rgba(0,255,162,0.15)]",
            bar: "bg-[#00ffa2]",
            button: "hover:bg-[#00ffa2]/20 border-[#00ffa2]/40 text-[#00ffa2]",
            status: "ACTIVE"
        };
    }
};

export default function ImageAgent({ uploadTime = 0 }: { uploadTime?: number }) {
  // 1. HOOK: useSWR (Always first)
  const { data: json, isLoading } = useSWR("http://localhost:8000/imagedata", fetcher, {
    refreshInterval: 2000, 
    revalidateOnFocus: true,
  });

  const analysis = json?.analysis;
  
  // 2. PREPARE DATA FOR TYPEWRITER (Must happen before any return)
  // We provide a fallback string so the hook always has something to process
  const rawSummary = analysis?.overall_situation || "System initializing. No visual threats processed yet.";
  
  // 3. HOOK: useTypewriter (MOVED UP - FIXED)
  // This must be called unconditionally
  const animatedSummary = useTypewriter(rawSummary, 15);

  // 4. INTELLIGENT LOADING LOGIC
  const reportTime = json?.generated_at ? new Date(json.generated_at).getTime() : 0;
  const isProcessing = uploadTime > 0 && reportTime < uploadTime;

  // --- CONDITIONAL RETURN 1: INITIAL LOADING ---
  if (isLoading) return <div className="text-[#00ffa2]/70 text-xs animate-pulse p-4 font-mono">Initializing Visual Feed...</div>;

  // --- CONDITIONAL RETURN 2: WAITING / PROCESSING STATE ---
  if (!analysis || isProcessing) {
    return (
      <div className="flex items-center justify-center p-4 border border-[#00ffa2]/30 rounded-xl bg-[#000510]">
        <div className="flex flex-col items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ffa2] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00ffa2]"></span>
            </span>
            <p className="text-[#00ffa2] text-xs tracking-widest uppercase opacity-70 font-mono animate-pulse">
                {isProcessing ? "Analyzing New Image..." : "Awaiting Analysis..."}
            </p>
        </div>
      </div>
    );
  }

  // --- SUCCESS STATE PREPARATION ---
  // (Variables that are only needed for the success view)
  const relatedIncidents = analysis?.related_incidents || null;
  const threatLevel = analysis.threat_assessment?.level || "Unknown";
  const concerns = analysis.threat_assessment?.concerns || "None";
  const timestamp = json.generated_at || new Date().toISOString();
  const briefFindings = analysis.individual_summaries || [];

  const theme = getTheme(threatLevel);

  return (
    <div>
      <div className="flex items-start gap-4 justify-center">
        <div className={`
          flex-1 relative 
          bg-[linear-gradient(90deg,rgba(255,255,255,0.05),rgba(255,255,255,0.1),rgba(255,255,255,0.05))]
          border ${theme.border} 
          ${theme.glow}
          rounded-xl 
          p-4 
          overflow-hidden
          transition-colors duration-500
        `}>
          
          <div className={`absolute left-0 top-0 h-full w-1 ${theme.bar} rounded-l-xl shadow-[0_0_10px_currentColor]`}></div>

          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] opacity-60 text-gray-300 font-mono">
              {new Date(timestamp).toLocaleTimeString()}
            </p>

            <div className="flex items-center gap-2">
              <h3 className={`text-sm font-bold tracking-wider font-mono ${theme.color}`}>
                IMAGE INTELLIGENCE
              </h3>
              <span className={`text-[10px] px-2 py-px rounded-full border animate-pulse font-semibold ${theme.bg} ${theme.border} ${theme.color}`}>
                {theme.status}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-start mb-3 bg-[#00000040] p-3 rounded border border-white/5">
             <div>
                <p className={`text-[10px] uppercase tracking-wider font-semibold opacity-80 ${theme.color}`}>Threat Level</p>
                <p className={`text-sm font-bold mt-1 ${theme.color} drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]`}>
                   {threatLevel.toUpperCase()}
                </p>
             </div>
             <div className="text-right max-w-[60%]">
                <p className={`text-[10px] uppercase tracking-wider font-semibold opacity-80 ${theme.color}`}>Primary Concern</p>
                <p className="text-xs text-gray-200 leading-tight line-clamp-2 mt-1 font-medium">
                   {concerns}
                </p>
             </div>
          </div>

          <div className="mb-3">
            <strong className={`text-xs uppercase block mb-1 tracking-wide opacity-80 ${theme.color}`}>Situation Report: </strong>
            <div className="text-gray-200 text-xs font-mono leading-relaxed bg-[#00000040] p-3 rounded border-l-2 border-white/10 min-h-[3rem]">
              {/* Uses the animatedSummary from the hook we called earlier */}
              <ReactMarkdown>{animatedSummary}</ReactMarkdown>
              {animatedSummary.length < rawSummary.length && (
                 <span className={`inline-block w-2 h-4 ml-1 animate-pulse align-middle ${theme.bar}`}/>
              )}
            </div>
          </div>

          {relatedIncidents && (
            <div className={`mb-3 p-2 border-l-2 bg-opacity-10 rounded-r ${theme.border} ${theme.bg}`}>
              <strong className={`text-[10px] uppercase block mb-1 tracking-wider flex items-center gap-1 ${theme.color}`}>
                ⚠️ Correlation Detected
              </strong>
              <p className="text-[11px] text-gray-300 opacity-90 leading-tight">
                {relatedIncidents}
              </p>
            </div>
          )}

          {briefFindings.length > 0 && (
             <div className="mb-2">
                <strong className={`text-xs uppercase block mb-1 tracking-wide opacity-80 ${theme.color}`}>Detected Elements:</strong>
                <ul className="space-y-1">
                   {briefFindings.map((item: any, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-[11px] text-gray-400 border-b border-white/10 pb-2 last:border-0 pt-1">
                         <span className={`${theme.color} mt-0.5`}>▸</span>
                         <span className="w-full leading-snug">{item.summary}</span>
                      </li>
                   ))}
                </ul>
             </div>
          )}

          <div className="flex items-end justify-end mt-4">
            <Link href="/image">
                <button className={`bg-transparent text-[10px] uppercase tracking-wider py-1.5 px-4 rounded border transition-all hover:scale-105 active:scale-95 font-semibold ${theme.button}`}>
                View Full Evidence
                </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}