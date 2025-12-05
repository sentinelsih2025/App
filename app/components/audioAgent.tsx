import { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface VisualData {
    object_detection?: string[];
    threat_posture?: string;
    environment_clues?: string[];
    weather?: string;
}

interface SummaryData {
    file_name: string;
    file_type: string;
    timestamp: string;
    visual_data?: VisualData;
    detailed_summary: string;
}

export default function AudioAgent() {
    const [data, setData] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8000/audiodata")
            .then((res) => res.json())
            .then((json) => {

                if (json.incidents && json.incidents.length > 0) {
                    const first = json.incidents[0];

                    const mapped: SummaryData = {
                        file_name: first.file_name,
                        file_type: "image",
                        timestamp: first.timestamp,
                        visual_data: {
                            object_detection: first.key_findings || [],
                            threat_posture: first.threat_level || "Unknown"
                        },
                        detailed_summary: first.detailed_summary
                    };

                    setData(mapped);
                } else {
                    setData(null);
                }

                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>No data found</p>;

    const { timestamp, visual_data, detailed_summary } = data;

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

                    <p className="text-[#e6faff] mt-2">
                        <strong className="text-[#1df2ff80]">Summary: </strong>
                         <span className="text-[#e6faff] prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{detailed_summary}</ReactMarkdown>
                    </span>
                    </p>

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
                            <Link href="/audio">View Details</Link>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
