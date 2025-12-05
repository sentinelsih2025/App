"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

// --------------------------------------------------
// INTERFACES
// --------------------------------------------------
interface FileItem {
  key?: string;
  url?: string;
  size?: number | null;
  lastModified?: string | null;

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

export default function TextDetails() {
  const searchParams = useSearchParams();

  const [itemList, setItemList] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [fastDataMap, setFastDataMap] = useState<Record<string, DynamicFileContent>>({});
  const [fastLoading, setFastLoading] = useState(false);

  // --------------------------------------------------
  // 1) Fetch S3 File List — ONLY TXT FILES
  // --------------------------------------------------
  useEffect(() => {
    let mounted = true;

    async function loadList() {
      try {
        setLoading(true);

        const res = await fetch("/api/files?type=text"); 
        const json = await res.json();

        if (!mounted) return;

        // FILTER ONLY .txt FILES
        const txtOnly = (json.files || []).filter((file: any) =>
          file.key?.toLowerCase().endsWith(".txt")
        );

        const mapped = txtOnly.map((file: any) => ({
          ...file,
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
        console.error("Error loading txt list:", err);
        setItemList([]);
      } finally {
        setLoading(false);
      }
    }

    async function fetchSingleAndPrepend(keyParam: string) {
      try {
        const res = await fetch(`/api/files?key=${encodeURIComponent(keyParam)}&type=text`);
        if (!res.ok) return;
        const json = await res.json();

        const file = json.files?.[0];
        if (!file) return;

        // only .txt
        if (!file.key?.toLowerCase().endsWith(".txt")) return;

        setItemList((prev) => {
          const without = prev.filter((p) => p.key !== file.key);
          return [file, ...without];
        });
      } catch (err) {
        console.warn("Failed single txt file:", err);
      }
    }

    loadList();

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.key) fetchSingleAndPrepend(detail.key);
    };

    window.addEventListener("text-updated", handler);

    return () => {
      mounted = false;
      window.removeEventListener("text-updated", handler);
    };
  }, []);

  // --------------------------------------------------
  // 2) Fetch Dynamic FastAPI Data
  // --------------------------------------------------
  useEffect(() => {
    if (itemList.length === 0) return;

    let mounted = true;

    async function loadFastAPI() {
      try {
        setFastLoading(true);

        const res = await fetch("http://localhost:8000/text");
        if (!res.ok) throw new Error("FastAPI failed");

        const dataArr: DynamicFastAPIItem[] = await res.json();
        const map: Record<string, DynamicFileContent> = {};

        for (const file of itemList) {
          const s3Name = file.key?.split("/").pop();
          if (!s3Name) continue;

          const match = dataArr.find((item) => item.content.file_name === s3Name);
          if (match) map[file.key!] = match.content;
        }

        if (mounted) setFastDataMap(map);
      } catch (err) {
        console.error("FastAPI summary error:", err);
      } finally {
        setFastLoading(false);
      }
    }

    loadFastAPI();

    return () => {
      mounted = false;
    };
  }, [itemList]);

  const getFastData = (key?: string) => (key ? fastDataMap[key] : undefined);

  // --------------------------------------------------
  // RENDER UI
  // --------------------------------------------------
  return (
    <div className="p-6 w-full -mt-[70px] bg-[#05080F] min-h-screen text-[#D8DFEA]">

      {/* Back */}
      <button className="px-4 py-2 mb-6 bg-[#0A1220] border border-[#1A2A40] rounded flex items-center gap-2">
        <span className="material-symbols-outlined">arrow_back</span>
        <Link href="/home">Back to Home</Link>
      </button>

      <h2 className="text-3xl font-bold text-[#4CC9FF] mb-6">Text Data Source</h2>

      {(loading || fastLoading) && (
        <div className="text-sm opacity-70">
          {loading ? "Loading text files..." : "Loading text summaries..."}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {itemList.length > 0 ? (
          itemList.map((f) => {
            const fast = getFastData(f.key);

            return (
              <div key={f.key}>
                <div className="p-6 rounded-xl bg-[#0A111D] border border-[#1C2F4A] shadow-lg flex flex-col md:flex-row gap-6">

                  {/* TXT Preview */}
                  <div className="w-full md:w-1/3 h-56 rounded-lg overflow-hidden border border-[#1C2F4A] bg-black/40 p-4">
                    {f.url ? (
                      <iframe src={f.url} className="w-full h-full border-none rounded" />
                    ) : (
                      <div className="opacity-60">No preview</div>
                    )}
                  </div>

                  {/* Data */}
                  <div className="text-sm md:w-2/3">
                    {fast ? (
                      <>
                        <div className="mb-3">
                          <strong>File:</strong> {fast.file_name}
                        </div>

                        <div className="mb-3">
                          <strong>Timestamp:</strong>{" "}
                          {new Date(fast.timestamp).toLocaleString()}
                        </div>

                        <div>
                          <strong>Summary:</strong>
                          <p className="opacity-80 mt-1">{fast.summary}</p>
                        </div>
                      </>
                    ) : (
                      <div className="text-red-400 text-sm">
                        No Dynamic Summary Found
                      </div>
                    )}
                  </div>
                </div>

                <div className="h-px bg-[#1F314B] mt-6"></div>
              </div>
            );
          })
        ) : (
          <div className="text-xs opacity-60">No .txt files uploaded yet.</div>
        )}
      </div>
    </div>
  );
}
