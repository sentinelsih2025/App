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

// --- FETCHER ---
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function VideoAgent() {
  // 1. HOOK: SWR (Always first)
  const { data: json, isLoading } = useSWR("http://localhost:8000/videodata", fetcher, {
    refreshInterval: 3000, 
    revalidateOnFocus: true,
  });

  // 2. PREPARE DATA (Extract correctly from 'analysis')
  const analysis = json?.analysis;
  const rawSummary = analysis?.overall_situation || "";
  
  // 3. HOOK: Typewriter (Before any returns!)
  const animatedSummary = useTypewriter(rawSummary, 15);

  // 4. LOADING STATE
  if (isLoading) return <div className="text-[#b8d8ff] text-xs animate-pulse p-4">Initializing Video Uplink...</div>;

  // 5. WAITING STATE (Instead of disappearing)
  if (!analysis) {
    return (
      <div className="flex items-center justify-center p-4 border border-[#1df2ff30] rounded-xl bg-[#000510]">
        <div className="flex flex-col items-center gap-2">
            {/* Radar Animation */}
            <div className="relative flex h-8 w-8 items-center justify-center">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
               <div className="w-2 h-2 bg-emerald-500 rounded-full z-10"></div>
               <div className="absolute w-full h-full border border-emerald-500/30 rounded-full animate-[spin_3s_linear_infinite] border-t-emerald-400"></div>
            </div>
            <p className="text-[#1df2ff] text-xs tracking-widest uppercase opacity-70">
                Awaiting Video Feed...
            </p>
        </div>
      </div>
    );
  }

  // 6. SUCCESS STATE
  const threatLevel = analysis.threat_assessment?.level || "Unknown";
  const timestamp = json.generated_at || new Date().toISOString();
  
  // Try to grab specific details from the individual summaries if available
  const detectedObjects = analysis.individual_summaries?.[0]?.summary || "Motion Detected";

  return (
    <div>
      <div className="flex items-start gap-4 justify-center">
        <div className="
          flex-1 relative 
          bg-[linear-gradient(90deg,rgba(255,255,255,0.12),rgba(255,255,255,0.35),rgba(255,255,255,0.12))]
          border border-[#1df2ff80] 
          rounded-xl 
          p-4 
          overflow-hidden
        ">

          <div className="absolute left-0 top-0 h-full w-1 bg-[#00ebf780] rounded-l-xl"></div>

          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] opacity-50 text-[#b8d8ff]">
              {new Date(timestamp).toLocaleString()}
            </p>

            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[#1df2ff80] tracking-wide">
                VIDEO INTELLIGENCE
              </h3>
              <span className="text-[10px] px-2 py-px rounded-full bg-[#1df2ff20] text-[#1df2ff] border border-[#1df2ff50]">
                Active
              </span>
            </div>
          </div>

          <div className="text-[#e6faff]">
            <p>
              <strong className="text-[#1df2ff80]">Visual Analysis:</strong>{" "}
              {detectedObjects}
            </p>
            <p>
              <strong className="text-[#1df2ff80]">Threat Posture:</strong>{" "}
              <span className={threatLevel === "High" ? "text-red-400 font-bold" : "text-[#1df2ff]"}>
                {threatLevel}
              </span>
            </p>
          </div>

          <div className="text-[#e6faff] mt-2">
            <strong className="text-[#1df2ff80]">Summary: </strong>
            <div className="text-[#e6faff] prose prose-invert prose-sm max-w-none inline leading-relaxed">
              <ReactMarkdown>{animatedSummary}</ReactMarkdown>
              {animatedSummary.length < rawSummary.length && (
                 <span className="inline-block w-2 h-4 bg-[#1df2ff] ml-1 animate-pulse align-middle"/>
              )}
            </div>
          </div>

          <div className="flex items-end justify-end mt-3">
            <button className="bg-[#1df2ff30] py-1 px-3 rounded-3xl text-[#1df2ff] border border-[#1df2ff70] hover:bg-[#1df2ff50] transition">
              <Link href="/video">View Full Report</Link>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}