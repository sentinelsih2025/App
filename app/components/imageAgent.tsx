import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function ImageAgent() {
    const [data, setData] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8000/imagedata")
            .then((res) => {
                console.log("Response Status:", res.status);
                return res.json();
            })
            .then((json) => {
                console.log("Fetched Data:", json);

                // 🚀 Extract first incident
                if (json.incidents && json.incidents.length > 0) {
                    const first = json.incidents[0];

                    const mapped: SummaryData = {
                        file_name: first.file_name,
                        file_type: "image", // default since backend didn't include
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
            .catch((err) => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>No data found</p>;

    const { file_name, file_type, timestamp, visual_data, detailed_summary } = data;

    return (
        <div>
            <div className="flex items-start gap-4 justify-center">
                <div className="flex-1 relative bg-[#111929] border border-lime-500 rounded-xl p-4 shadow-lg shadow-black/20 backdrop-blur-sm overflow-hidden">

                    <div className="absolute left-0 top-0 h-full w-1 bg-lime-400 rounded-l-xl"></div>

                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] opacity-40">
                            {new Date(timestamp).toLocaleString()}
                        </p>

                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-lime-300 tracking-wide">
                                IMAGE INTELLIGENCE
                            </h3>
                            <span className="text-[10px] px-2 py-px rounded-full bg-lime-500/20 text-lime-400 tracking-wide">
                                Active
                            </span>
                        </div>
                    </div>

                    {visual_data && (
                        <div>
                            <p>
                                <strong>Object Detection:</strong>{" "}
                                {visual_data.object_detection?.join(", ") || "N/A"}
                            </p>
                            <p>
                                <strong>Threat Posture:</strong>{" "}
                                {visual_data.threat_posture ?? "N/A"}
                            </p>
                        </div>
                    )}

                    <p><strong>Summary: </strong>{detailed_summary}</p>

                    <div className="flex items-end justify-end">
                        <button className="bg-lime-700 py-1 px-3 rounded-3xl">
                            <Link href="/image">View Details</Link>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
