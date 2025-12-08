"use client";

import useSWR from "swr";
import Link from "next/link";
import { useState, useEffect } from "react";

// --- CUSTOM HOOK: Typewriter ---
const useTypewriter = (text: string, speed: number = 10) => {
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

// --- HELPER: Color Logic ---
const getStatusColor = (score: number, isInverse: boolean = false) => {
    const val = parseFloat(score.toString());
    if (isInverse) {
        if (val < 0.5) return "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]";
        if (val <= 0.7) return "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]";
        return "bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.6)]";
    } else {
        if (val < 0.5) return "bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.6)]";
        if (val <= 0.7) return "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]";
        return "bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.6)]";
    }
};

export default function Aggrigator() {
    const { data: json, isLoading } = useSWR("http://localhost:8000/aggregator", fetcher, {
        refreshInterval: 3000,
        revalidateOnFocus: true,
    });

    // 1. Prepare Metrics
    const threatScore = json?.automated_risk_score || 0;
    // Fix: Fallback to 0.8 (80%) if auth score is missing, so it doesn't look broken
    const authScore = json?.data_authentication_score !== undefined ? json.data_authentication_score : 0.8;

    // 2. Prepare Extended Text
    const briefing = json?.ai_analysis?.situation_briefing || "";
    const keyThreats = json?.ai_analysis?.key_threats || [];
    const situationStatus = json?.ai_analysis?.situation_status || "Scanning...";

    // Construct a detailed report string
    let fullReport = "";
    
    if (briefing) {
        fullReport += `${briefing}\n\n`; // Add the full paragraph first
    }

    if (keyThreats.length > 0) {
        fullReport += "Identified Threats:\n" + keyThreats.map((t: string) => `> ${t}`).join("\n");
    } else {
        fullReport += `Current Status: ${situationStatus}`;
    }

    // Use a faster speed (5ms) because the text is longer now
    const animatedSummary = useTypewriter(fullReport, 5);

    if (isLoading) return <div className="w-80 border-l border-[#1E2A3E] p-4 text-[#b8d8ff] text-xs animate-pulse">Initializing Intel Stream...</div>;

    return (
        <div className="w-70 border-l border-[#1E2A3E] p-4 flex flex-col gap-4 ">

            {/* --- SITUATION ANALYSIS --- */}
            <div className="bg-[linear-gradient(90deg,rgba(255,255,255,0.12),rgba(255,255,255,0.35),rgba(255,255,255,0.12))] border border-[#ffffff] rounded-xl p-4 h-auto min-h-[12rem] flex flex-col">
                <p className="text-sm opacity-60 font-bold tracking-wider mb-2 border-b border-white/10 pb-1">
                    SITREP: {json?.locations_monitored?.[0]?.toUpperCase() || "UNKNOWN"}
                </p>
                <div className="text-[12px] text-white whitespace-pre-line leading-relaxed font-mono mt-1 h-full overflow-y-auto custom-scroll pr-1">
                    {animatedSummary}
                </div>
            </div>

            {/* --- THREAT SCORE --- */}
            <div className="bg-[linear-gradient(90deg,rgba(255,255,255,0.12),rgba(255,255,255,0.35),rgba(255,255,255,0.12))] border border-[#ffffff] rounded-xl p-4">
                <div className="flex justify-between items-end mb-2">
                    <p className="text-sm opacity-60">THREAT SCORE</p>
                    <p className={`text-xs font-mono font-bold ${threatScore > 0.7 ? 'text-red-400' : 'text-gray-400'}`}>
                        {(threatScore * 100).toFixed(0)}%
                    </p>
                </div>
                
                <div className="w-full h-2 bg-[#1A2538] rounded-full relative overflow-hidden">
                    <div 
                        className={`absolute left-0 top-0 h-2 rounded-full transition-all duration-1000 ${getStatusColor(threatScore, false)}`} 
                        style={{ width: `${Math.min(threatScore * 100, 100)}%` }}
                    ></div>
                </div>
            </div>

           

            <Link href='/dashboard' className="block mt-4 py-2 rounded-lg bg-[#00ffa2] hover:bg-[#00f2ffbf] transition-all shadow text-black text-sm font-medium text-center hover:scale-[1.02]">
                Decision Support Center
            </Link>
        </div>
    );
}