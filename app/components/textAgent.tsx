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

export default function TextAgent() {
  // 1. HOOK: SWR (Always first)
  const { data: json, isLoading } = useSWR("http://localhost:8000/textdata", fetcher, {
    refreshInterval: 3000, 
    revalidateOnFocus: true,
  });

  // 2. PREPARE DATA (Correctly extracting from 'analysis')
  const analysis = json?.analysis;
  const rawSummary = analysis?.overall_situation || "";
  
  // 3. HOOK: Typewriter (Called before any returns)
  const animatedSummary = useTypewriter(rawSummary, 15);

  // 4. LOADING STATE
  if (isLoading) return <div className="text-[#b8d8ff] text-xs animate-pulse p-4">Decrypting Intelligence Reports...</div>;

  // 5. WAITING STATE (Instead of returning null)
  if (!analysis) {
    return (
      <div className="flex items-center justify-center p-4 border border-[#1df2ff30] rounded-xl bg-[#000510]">
        <div className="flex flex-col items-center gap-2">
            {/* Binary/Text Animation */}
            <div className="flex gap-1">
                <span className="text-[10px] text-sky-500 animate-pulse">101</span>
                <span className="text-[10px] text-sky-400 animate-pulse delay-75">010</span>
                <span className="text-[10px] text-sky-600 animate-pulse delay-150">110</span>
            </div>
            <p className="text-[#1df2ff] text-xs tracking-widest uppercase opacity-70">
                Awaiting Text Intel...
            </p>
        </div>
      </div>
    );
  }

  // 6. SUCCESS STATE
  const threatLevel = analysis.threat_assessment?.level || "Unknown";
  const timestamp = json.generated_at || new Date().toISOString();
  
  // Try to grab key entities from the analysis structure if available
  // Adjust this path if your backend puts entities elsewhere, e.g. analysis.entities
  const keyEntities = analysis.individual_summaries?.[0]?.summary 
                      ? "Entities Extracted" 
                      : "Processing Content...";

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
                TEXT INTELLIGENCE
              </h3>
              <span className="text-[10px] px-2 py-px rounded-full bg-[#1df2ff20] text-[#1df2ff] border border-[#1df2ff50]">
                Active
              </span>
            </div>
          </div>

          <div className="text-[#e6faff]">
            <p>
              <strong className="text-[#1df2ff80]">Analysis Status:</strong>{" "}
              {keyEntities}
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
              <Link href="/text">View Full Report</Link>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}