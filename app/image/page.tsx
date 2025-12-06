"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import Link from "next/link";
import useSWR, { mutate } from "swr"; // 1. Import SWR

// --- INTERFACES ---

interface FileItem {
  key?: string; 
  url?: string; 
  size?: number | null;
  lastModified?: string | null;
  // Existing placeholder detection field
  detection?: {
    objectDetection?: string;
    attackers?: number;
    threatPosture?: string;
    summary?: string;
  };
}

interface VisualData {
  object_detection?: string[];
  number_of_attackers?: number;
  threat_posture?: string;
  environment_clues?: string[];
  weather?: string;
}

interface DynamicFileContent {
  file_name: string;
  file_type: string;
  timestamp: string;
  visual_data?: VisualData;
  summary: string;
}

interface DynamicFastAPIItem {
  filename: string;
  content: DynamicFileContent;
}

// --- FETCHER FUNCTION ---
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ImageDetail() {
  const searchParams = useSearchParams();

  // ---------------------------------------------------------
  // 1. DATA FETCHING WITH SWR
  // ---------------------------------------------------------

  // A. Fetch S3 File List (Auto-updates on focus)
  const { 
    data: s3Data, 
    isLoading: s3Loading 
  } = useSWR("/api/files?type=image", fetcher);

  // B. Fetch AI Analysis (POLLING enabled: checks every 3 seconds)
  const { 
    data: fastApiData, 
    isLoading: fastLoading 
  } = useSWR<DynamicFastAPIItem[]>(
    "http://localhost:8000/image", 
    fetcher, 
    {
      refreshInterval: 3000, // ⚡️ The Magic: Polls for new AI results
      revalidateOnFocus: true,
      dedupingInterval: 1000,
    }
  );

  // ---------------------------------------------------------
  // 2. DATA MERGING (Replaces the complex useEffect)
  // ---------------------------------------------------------
  
  const mergedItems = useMemo(() => {
    const files: FileItem[] = s3Data?.files || [];
    const aiResults: DynamicFastAPIItem[] = fastApiData || [];

    return files.map((file) => {
      const s3FileBaseName = file.key?.split("/").pop(); // e.g., 'image-123.jpg'
      
      // Find matching AI result
      const match = aiResults.find((item) => {
        // Match the S3 filename with the filename stored INSIDE the JSON content
        return item.content.file_name === s3FileBaseName;
      });

      return {
        ...file,
        fastData: match ? match.content : undefined
      };
    });
  }, [s3Data, fastApiData]);

  // ---------------------------------------------------------
  // 3. EVENT LISTENER (For instant updates after upload)
  // ---------------------------------------------------------
  
  useEffect(() => {
    // When a new file is uploaded, just tell SWR to re-fetch the list immediately
    const handler = () => mutate("/api/files?type=image");
    
    if (typeof window !== 'undefined') window.addEventListener('images-updated', handler);
    return () => {
      if (typeof window !== 'undefined') window.removeEventListener('images-updated', handler);
    };
  }, []);

  // ---------------------------------------------------------
  // 4. UI RENDER
  // ---------------------------------------------------------
  
  const loading = s3Loading; // Primary loading state

  return (
    <div className="p-6 w-full -mt-[70px] bg-[#05080F] min-h-screen text-[#D8DFEA]">
      {/* BACK BUTTON */}
      <button className="px-4 py-2 mb-6 bg-[#0A1220] border border-[#1A2A40] rounded hover:bg-[#111B2F] transition flex items-center gap-2">
        <span className="material-symbols-outlined">arrow_back</span>
        <Link href="/home">Back to Home</Link>
      </button>

      {/* TITLE */}
      <h2 className="text-3xl font-bold mb-6 tracking-wide text-[#4CC9FF] drop-shadow-[0_0_5px_#4CC9FF]">
        Image Data Source
      </h2>

      {/* STATUS INDICATORS */}
      <div className="flex gap-4 mb-4 text-xs opacity-70">
        {loading && <div className="animate-pulse text-blue-400">Loading S3 Files...</div>}
        {fastLoading && !loading && <div className="animate-pulse text-green-400">Syncing AI Data...</div>}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {mergedItems.length > 0 ? (
          mergedItems.map((f) => {
            const fast = f.fastData;

            // Resolve Summary and Visuals
            const summary =
              f.detection?.summary ||
              fast?.summary ||
              "Processing..."; // Changed default to Processing to indicate work in progress

            const visual = fast?.visual_data;
            
            // Prioritize AI timestamp, then S3 modified time
            const timestamp =
              fast?.timestamp ||
              f.lastModified ||
              null;

            return (
              <div key={f.key}>
                {/* Card */}
                <div
                  className="
                    p-6 rounded-xl shadow-lg 
                    bg-linear-to-br from-[#0A111D] to-[#0C1626]
                    border border-[#1C2F4A]
                    hover:border-[#3FA0FF]
                    hover:shadow-[0_0_15px_#206A9F]
                    transition-all duration-200
                    flex flex-col md:flex-row items-start gap-6
                  "
                >
                  {/* IMAGE */}
                  <div
                    className="
                      w-full md:w-1/3 h-56 rounded-lg overflow-hidden 
                      shadow-inner border border-[#1C2F4A] bg-black/40
                    "
                  >
                    {f.url ? (
                      <img
                        src={f.url}
                        alt={String(f.key)}
                        className="w-full h-full object-cover hover:scale-105 transition"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">No Image URL</div>
                    )}
                  </div>
                
                  {/* DATA DISPLAY */}
                  {fast ? (
                    <div className="mt-3 text-sm text-[#D6E6F6] space-y-3 md:w-2/3">
                      <div>
                        <h4 className="text-xs font-semibold text-[#9FD7FF]">File Details (from FastAPI)</h4>
                        <div className="mt-2 text-xs space-y-1">
                          <div><strong>File Name:</strong> {fast.file_name}</div>
                          <div><strong>File Type:</strong> {fast.file_type}</div>
                          <div><strong>Timestamp:</strong> {timestamp ? new Date(timestamp).toLocaleString() : "-"}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-[#9FD7FF]">Visual Data</h4>
                        <div className="mt-2 text-xs space-y-1">
                          <div><strong>Object Detection:</strong> {visual?.object_detection?.join(', ') ?? 'N/A'}</div>
                          <div><strong>Number of Attackers:</strong> {visual?.number_of_attackers ?? 'N/A'}</div>
                          <div><strong>Threat Posture:</strong> {visual?.threat_posture ?? 'N/A'}</div>
                          <div><strong>Environment Clues:</strong> {visual?.environment_clues ? visual.environment_clues.join(' | ') : 'N/A'}</div>
                          <div><strong>Weather:</strong> {visual?.weather ?? 'N/A'}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-[#9FD7FF]">Summary</h4>
                        <p className="mt-1 text-xs opacity-80">{summary}</p>
                      </div>
                    </div>
                  ) : (
                    // Fallback / Loading State for individual item
                    <div className="mt-2 text-sm text-[#7A8C9E] md:w-2/3 flex flex-col justify-center h-full">
                      <div className="text-amber-400 font-semibold flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                        Analyzing Content...
                      </div>
                      <p className="mt-2 text-xs opacity-60">
                        The AI agent is currently processing this image. Results will appear automatically in a few seconds.
                      </p>
                      <div className="mt-4 pt-4 border-t border-gray-800">
                         <p className="text-xs text-gray-500">Filename: {f.key?.split("/").pop()}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-linear-to-r from-transparent via-[#1F314B] to-transparent mt-6"></div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 opacity-60">
             <span className="material-symbols-outlined text-4xl mb-2">image_search</span>
             <p>No uploaded images found.</p>
          </div>
        )}
      </div>
    </div>
  );
}