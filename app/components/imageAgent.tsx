"use client";

import useSWR from "swr";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

// --- INTERFACES ---
interface VisualData {
    object_detection?: string[];
    threat_posture?: string;
    environment_clues?: string[];
    weather?: string;
}

// --- FETCHER ---
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ImageAgent() {
    // 1. SWR Hook (Replaces useEffect & useState)
    const { data: json, isLoading } = useSWR("http://localhost:8000/imagedata", fetcher, {
        refreshInterval: 3000, // Polls every 3 seconds
        revalidateOnFocus: true,
    });

    // 2. Data Processing (Derived state)
    // We check if data exists and grab the first incident immediately
    const firstIncident = json?.incidents?.[0];

    // 3. Loading / Empty States
    // I added some styling to these to match your theme better
    if (isLoading) return <p className="text-[#b8d8ff] text-xs opacity-60 animate-pulse">Loading Intelligence...</p>;
    if (!firstIncident) return <p className="text-[#b8d8ff] text-xs opacity-60">No active image data found</p>;

    // 4. Map the data for display
    const timestamp = firstIncident.timestamp;
    const detailed_summary = firstIncident.detailed_summary;
    
    // Construct visual_data based on your API structure (key_findings -> object_detection)
    const visual_data: VisualData = {
        object_detection: firstIncident.key_findings || [],
        threat_posture: firstIncident.threat_level || "Unknown",
    };

    // 5. Render UI (Unchanged)
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
                                IMAGE INTELLIGENCE
                            </h3>

                            <span className="
                                text-[10px] 
                                px-2 py-px 
                                rounded-full 
                                bg-[#1df2ff20] 
                                text-[#1df2ff] 
                                tracking-wide
                                border border-[#1df2ff50]
                            ">
                                Active
                            </span>
                        </div>
                    </div>

                    {visual_data && (
                        <div className="text-[#e6faff]">
                            <p>
                                <strong className="text-[#1df2ff80]">Object Detection:</strong>{" "}
                                {visual_data.object_detection?.join(", ") || "N/A"}
                            </p>
                            <p>
                                <strong className="text-[#1df2ff80]">Threat Posture:</strong>{" "}
                                {visual_data.threat_posture ?? "N/A"}
                            </p>
                        </div>
                    )}

                    <div className="text-[#e6faff] mt-2">
                        <strong className="text-[#1df2ff80]">Summary: </strong>
                        <div className="text-[#e6faff] prose prose-invert prose-sm max-w-none inline">
                            <ReactMarkdown>{detailed_summary}</ReactMarkdown>
                        </div>
                    </div>

                    <div className="flex items-end justify-end mt-3">
                        <button className="
                            bg-[#1df2ff30] 
                            py-1 px-3 
                            rounded-3xl 
                            text-[#1df2ff] 
                            border border-[#1df2ff70]
                            hover:bg-[#1df2ff50]
                            transition
                        ">
                            <Link href="/image">View Details</Link>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}