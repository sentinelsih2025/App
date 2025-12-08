"use client";

import useSWR from "swr";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";

// --- CUSTOM HOOK (Safe to keep here) ---
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

export default function AudioAgent() {
  // 1. HOOK: SWR (Always first)
  const { data: json, isLoading } = useSWR("http://localhost:8000/audiodata", fetcher, {
    refreshInterval: 3000, 
    revalidateOnFocus: true,
  });

  // 2. PREPARE DATA (Extracting correctly from 'analysis')
  const analysis = json?.analysis;
  const rawSummary = analysis?.overall_situation || "";
  
  // 3. HOOK: Typewriter (Called before any returns)
  const animatedSummary = useTypewriter(rawSummary, 15);

  // 4. LOADING STATE
  if (isLoading) return <div className="text-[#b8d8ff] text-xs animate-pulse p-4">Listening for Audio Events...</div>;

  // 5. WAITING STATE (Instead of returning null)
  if (!analysis) {
    return (
      <div className="flex items-center justify-center p-4 border border-[#1df2ff30] rounded-xl bg-[#000510]">
        <div className="flex flex-col items-center gap-2">
            {/* Audio Wave Animation */}
            <div className="flex gap-1 h-3 items-center">
              <span className="w-1 h-full bg-sky-500 animate-[pulse_1s_ease-in-out_infinite]"></span>
              <span className="w-1 h-2/3 bg-sky-500 animate-[pulse_1.2s_ease-in-out_infinite]"></span>
              <span className="w-1 h-full bg-sky-500 animate-[pulse_0.8s_ease-in-out_infinite]"></span>
            </div>
            <p className="text-[#1df2ff] text-xs tracking-widest uppercase opacity-70">
                Awaiting Audio Intel...
            </p>
        </div>
      </div>
    );
  }

  // 6. SUCCESS STATE (Map the data)
  const threatLevel = analysis.threat_assessment?.level || "Unknown";
  const timestamp = json.generated_at || new Date().toISOString();
  // Try to find detected sounds from the summary or individual files if available
  const soundDetection = analysis.individual_summaries?.[0]?.summary || "Analysis Complete";

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
                AUDIO INTELLIGENCE
              </h3>
              <span className="text-[10px] px-2 py-px rounded-full bg-[#1df2ff20] text-[#1df2ff] border border-[#1df2ff50]">
                Active
              </span>
            </div>
          </div>

          <div className="text-[#e6faff]">
            <p>
              <strong className="text-[#1df2ff80]">Threat Level:</strong>{" "}
              <span className={threatLevel === "High" ? "text-red-400 font-bold" : "text-[#1df2ff]"}>
                {threatLevel}
              </span>
            </p>
            <p>
              <strong className="text-[#1df2ff80]">Acoustic Analysis:</strong>{" "}
              {soundDetection}
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
              <Link href="/audio">View Full Report</Link>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}