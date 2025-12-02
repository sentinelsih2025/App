"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "../agentchart/image"

// --- INTERFACE UPDATES (Optional, but good practice) ---
// Define the structure for a single item from the S3/File List endpoint (e.g., /api/files)
interface FileItem {
  key?: string; // S3 Key (e.g., 'uploads/image-timestamp.jpg')
  url?: string; // AWS S3 URL
  size?: number | null;
  lastModified?: string | null;
  // Existing placeholder detection field (might be from another API)
  detection?: {
    objectDetection?: string;
    attackers?: number;
    threatPosture?: string;
    summary?: string;
  };
}

// Define the structure for the *content* inside a single dynamic JSON file
interface VisualData {
  object_detection?: string[];
  number_of_attackers?: number;
  threat_posture?: string;
  environment_clues?: string[];
  weather?: string;
}

interface DynamicFileContent {
  file_name: string; // Filename from the original JSON (e.g., 'report_1.json')
  file_type: string;
  timestamp: string;
  visual_data?: VisualData;
  summary: string;
}

// Define the structure for an item returned by the new /image FastAPI endpoint
interface DynamicFastAPIItem {
  filename: string; // The full JSON filename (e.g., 'report_1.json')
  content: DynamicFileContent; // The actual JSON content
}

export default function ImageDetail() {
  const searchParams = useSearchParams();
  const key = searchParams?.get("key") ?? ""; // Note: This key is not directly used in the new flow

  const [itemList, setItemList] = useState<FileItem[]>([]); // Data from /api/files
  const [loading, setLoading] = useState(false);

  // Maps the S3 Key (from itemList) to the DynamicFileContent (from /image endpoint)
  const [fastDataMap, setFastDataMap] = useState<Record<string, DynamicFileContent>>({});
  const [fastLoading, setFastLoading] = useState(false);
  
  // NOTE: 'data' state for a single item is no longer necessary as we fetch an array.
  // const [data, setData] = useState<SummaryData | null>(null);

  /* ---------------------------------------------------
      1) LOAD FILE LIST FROM /api/files (S3/Storage)
      (This populates 'itemList' which has the S3 'key' and 'url')
  -----------------------------------------------------*/
  useEffect(() => {
    let mounted = true;

    async function loadList() {
      try {
        setLoading(true);
        // Fetch the list of image files (e.g., from an S3 proxy endpoint)
        const res = await fetch("/api/files"); 
        const json = await res.json();

        if (!mounted) return;

        const mapped = (json.files || []).map((file: any) => ({
          ...file,
          // Existing mapping logic for a file's 'detection' property
          detection: file.visual_data 
            ? {
                objectDetection: file.visual_data.object_detection?.join(", "),
                attackers: file.visual_data.number_of_attackers,
                threatPosture: file.visual_data.threat_posture,
                summary: file.summary,
              }
            : null,
        }));

        setItemList(mapped);
      } catch (err) {
        console.error("Error loading file list:", err);
        if (mounted) setItemList([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadList();
    return () => {
      mounted = false;
    };
  }, []);

  /* ---------------------------------------------------
      2) LOAD FastAPI extra metadata (/image)
      (Fetches *all* JSON summaries and maps them to S3 keys)
  -----------------------------------------------------*/
  useEffect(() => {
    let mounted = true;

    async function fetchAllDynamicData() {
      // We wait for the file list to load so we can match the data
      if (!itemList || itemList.length === 0) return;

      try {
        setFastLoading(true);
        console.debug("Fetching all dynamic data from /image...");
        
        // --- SWITCHED TO THE NEW ENDPOINT ---
        const res = await fetch("http://localhost:8000/image"); 
        if (!res.ok) {
          throw new Error(`FastAPI /image returned status ${res.status}`);
        }

        // The response is an array of { filename: string, content: DynamicFileContent }
        const dataArray: DynamicFastAPIItem[] = await res.json();
        const newMap: Record<string, DynamicFileContent> = {};

        // Iterate over the list of S3 files and try to match them 
        // with the FastAPI data based on the filename/basename.
        for (const f of itemList) {
          const s3FileBaseName = f.key?.split("/").pop(); // e.g., 'image-timestamp.jpg'

          if (!s3FileBaseName) continue;

          // Find the matching data item from the /image response array
          const fastApiItem = dataArray.find((item) => {
            const jsonFileName = item.filename; // e.g., 'report_1.json'
            const contentFileName = item.content.file_name; // e.g., 'image-A.jpg' (as stored in the JSON)

            // The goal is to match the S3 basename (image-timestamp.jpg) 
            // with the filename stored *inside* the dynamic JSON.
            return contentFileName === s3FileBaseName;
          });

          if (fastApiItem) {
             // Use the S3 Key (f.key) to map the fetched data content
             newMap[f.key!] = fastApiItem.content;
          } else {
             // Fallback for cases where the JSON file_name might be the report filename
             // (e.g. report_1.json) and we need a different match logic.
             // This is an area for refinement based on your exact naming conventions.
             console.debug('FastAPI: no match for S3 key:', s3FileBaseName);
          }
        }

        if (mounted) {
          console.debug("Attached FastAPI data to keys:", Object.keys(newMap));
          // Update the map with all the successfully matched data
          setFastDataMap(newMap); 
        }
      } catch (err) {
        console.error("FastAPI /image error:", err);
      } finally {
        if (mounted) setFastLoading(false);
      }
    }

    fetchAllDynamicData();
    return () => {
      mounted = false;
    };
  }, [itemList]);


  // Helper function to find the fast data for a given S3 key
  const getFastData = (s3Key?: string): DynamicFileContent | undefined => {
      if (!s3Key) return undefined;
      return fastDataMap[s3Key];
  }


  /* ---------------------------------------------------
      UI RENDER
  -----------------------------------------------------*/
  return (
    <>
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

      {(loading || fastLoading) && (
        <div className="text-sm opacity-70 animate-pulse">
          {loading ? "Loading images list..." : "Loading dynamic summaries..."}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {itemList.length > 0 ? (
          itemList.map((f) => {
            // Retrieve the data from the map using the S3 file key
            const fast = getFastData(f.key); 
            
            // Use existing detection data or the new FastAPI data
            const summary =
              f.detection?.summary ||
              fast?.summary ||
              "No summary available";

            const visual = fast?.visual_data;
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
                  {/* IMAGE - **Ensure f.url is a correct AWS URL for this to work** */}
                  <div
                    className="
                      w-full md:w-1/3 h-56 rounded-lg overflow-hidden 
                      shadow-inner border border-[#1C2F4A] bg-black/40
                    "
                  >
                    <img
                      src={f.url}
                      alt={String(f.key)}
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />
                  </div>
                
                  {/* DATA DISPLAY */}
                  {fast ? (
                    <div className="mt-3 text-sm text-[#D6E6F6] space-y-3 md:w-2/3">
                      <div>
                        <h4 className="text-xs font-semibold text-[#9FD7FF]">File Details (from FastAPI)</h4>
                        <div className="mt-2 text-xs space-y-1">
                          <div><strong>File Name:</strong> {fast.file_name ?? f.key?.split("/").pop() ?? "-"}</div>
                          <div><strong>File Type:</strong> {fast.file_type ?? "-"}</div>
                          <div><strong>Timestamp:</strong> {new Date(fast.timestamp ?? timestamp ?? "").toLocaleString() ?? "-"}</div>
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
                        <p className="mt-1 text-xs opacity-80">{fast.summary ?? summary}</p>
                      </div>
                    </div>
                  ) : (
                    // Fallback if no specific dynamic data was found for this S3 item
                    <div className="mt-2 text-sm text-[#7A8C9E] md:w-2/3">
                      <div className="text-red-400"><strong>No Dynamic Data Found for this Image ({f.key?.split("/").pop()})</strong></div>
                      <p className="mt-1 text-xs opacity-80">Fallback Summary: {summary}</p>
                    </div>
                  )}


                </div>

                {/* Divider */}
                <div className="h-px w-full bg-linear-to-r from-transparent via-[#1F314B] to-transparent mt-6"></div>
              </div>
            );
          })
        ) : (
          <div className="text-xs opacity-60">No uploaded images yet.</div>
        )}
      </div>
    </div>

    <div className="px-18 py-8 bg-linear-to-br from-[#0A111D] to-[#0C1626]">
      <h1 className="text-3xl text-amber-100 mb-4">Chart with Image Agent</h1>
      <hr />
      <Image/>
    </div>
    
    </>
  );
}