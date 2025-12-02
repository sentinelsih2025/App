

import { useEffect, useState } from "react";

interface VisualData {
    object_detection?: string[];
    number_of_attackers?: number;
    threat_posture?: string;
    environment_clues?: string[];
    weather?: string;
}

interface SummaryData {
    file_name: string;
    file_type: string;
    timestamp: string;
    visual_data?: VisualData;
    summary: string;
}


export default function imageAgent() {

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
                setData(json);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>No data found</p>;

    const { file_name, file_type, timestamp, visual_data, summary } = data;




    return (
        <div>
            <div className="flex items-start gap-4 justify-center">

                {/* ICON */}
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center self-center 
      border border-lime-400/40 bg-[rgba(123,255,0,0.1)] 
      shadow-[0_0_8px_2px_rgba(163,255,79,0.4)] backdrop-blur-md">
                    <span className="text-xs tracking-wide text-lime-300 font-semibold">IMAGE</span>
                </div>

                {/* BOX */}
                <div className="flex-1 relative bg-[#111929] border border-lime-500 rounded-xl p-4 shadow-lg shadow-black/20 backdrop-blur-sm overflow-hidden">

                    {/* ACCENT LINE */}
                    <div className="absolute left-0 top-0 h-full w-1 bg-lime-400 rounded-l-xl"></div>

                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] opacity-40">{new Date(timestamp).toLocaleString()}</p>

                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-lime-300 tracking-wide">IMAGE INTELLIGENCE</h3>
                            <span className="text-[10px] px-2 py-px rounded-full bg-lime-500/20 text-lime-400 tracking-wide">Active</span>
                        </div>
                    </div>

                   

                        {visual_data && (
                            <div>
                                <p>
                                    <strong>Object Detection:</strong>{" "}
                                    {visual_data.object_detection ? visual_data.object_detection.join(", ") : "N/A"}
                                </p>
                                <p>
                                    <strong>Number of Attackers:</strong>{" "}
                                    {visual_data.number_of_attackers ?? "N/A"}
                                </p>
                                <p>
                                    <strong>Threat Posture:</strong>{" "}
                                    {visual_data.threat_posture ?? "N/A"}
                                </p>
                            </div>
                        )}


                       
                        <p> <strong>Summary : </strong>{summary}</p>
                    
                </div>
            </div>
        </div>
    )
}