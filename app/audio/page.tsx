"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

// --- AUDIO INTERFACES ---

// S3 File Item
interface FileItem {
  key?: string;
  url?: string;
  size?: number | null;
  lastModified?: string | null;
}

// FastAPI audio metadata structure
interface AudioData {
  transcription?: string;
  emotion?: string;
  keywords?: string[];
  language?: string;
}

interface DynamicAudioContent {
  file_name: string;
  file_type: string;
  timestamp: string;
  audio_data?: AudioData;
  summary: string;
}

interface DynamicFastAPIItem {
  filename: string;
  content: DynamicAudioContent;
}

export default function AudioDetail() {
  const searchParams = useSearchParams();
  const key = searchParams?.get("key") ?? "";

  const [itemList, setItemList] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [fastDataMap, setFastDataMap] = useState<
    Record<string, DynamicAudioContent>
  >({});
  const [fastLoading, setFastLoading] = useState(false);

  /* ---------------------------------------------------
        1) LOAD AUDIO LIST FROM /api/files?type=audio
  -----------------------------------------------------*/
  useEffect(() => {
    let mounted = true;

    async function loadList() {
      try {
        setLoading(true);
        const res = await fetch("/api/files?type=audio");
        const json = await res.json();

        if (!mounted) return;

        setItemList(json.files || []);
      } catch (err) {
        console.error("Error loading audio files:", err);
        if (mounted) setItemList([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    async function fetchSingleAndPrepend(keyParam: string) {
      try {
        const res = await fetch(
          `/api/files?key=${encodeURIComponent(keyParam)}&type=audio`
        );
        if (!res.ok) return;

        const json = await res.json();
        const file = json.files?.[0] || null;
        if (!file) return;

        setItemList((prev) => {
          const without = prev.filter((p) => p.key !== file.key);
          return [file, ...without];
        });
      } catch (err) {
        console.warn("Failed to fetch single audio:", err);
      }
    }

    loadList();

    if (typeof window !== "undefined") {
      const handler = (e: Event) => {
        const detail = (e as CustomEvent)?.detail;
        const k = detail?.key;
        if (k) fetchSingleAndPrepend(k);
      };
      window.addEventListener("audio-updated", handler);

      return () => {
        window.removeEventListener("audio-updated", handler);
        mounted = false;
      };
    }
  }, []);

  /* ---------------------------------------------------
        2) LOAD FastAPI AUDIO METADATA FROM /audio
  -----------------------------------------------------*/
  useEffect(() => {
    let mounted = true;

    if (!itemList || itemList.length === 0) return;

    async function fetchAudioMetadata() {
      try {
        setFastLoading(true);

        const res = await fetch("http://localhost:8000/audio");
        if (!res.ok) throw new Error("FastAPI /audio failed");

        const dataArray: DynamicFastAPIItem[] = await res.json();
        const newMap: Record<string, DynamicAudioContent> = {};

        for (const f of itemList) {
          const base = f.key?.split("/").pop();
          if (!base) continue;

          const match = dataArray.find(
            (item) => item.content.file_name === base
          );

          if (match) {
            newMap[f.key!] = match.content;
          }
        }

        if (mounted) setFastDataMap(newMap);
      } catch (err) {
        console.error("FastAPI /audio error:", err);
      } finally {
        if (mounted) setFastLoading(false);
      }
    }

    fetchAudioMetadata();

    return () => {
      mounted = false;
    };
  }, [itemList]);

  // Helper to fetch audio metadata
  const getFastData = (s3Key?: string) =>
    s3Key ? fastDataMap[s3Key] : undefined;

  /* ---------------------------------------------------
        UI RENDER
  -----------------------------------------------------*/
  return (
    <div className="p-6 w-full -mt-[70px] bg-[#05080F] min-h-screen text-[#D8DFEA]">
      {/* BACK BUTTON */}
      <button className="px-4 py-2 mb-6 bg-[#0A1220] border border-[#1A2A40] rounded hover:bg-[#111B2F] transition flex items-center gap-2">
        <span className="material-symbols-outlined">arrow_back</span>
        <Link href="/home">Back to Home</Link>
      </button>

      {/* TITLE */}
      <h2 className="text-3xl font-bold mb-6 tracking-wide text-[#4CC9FF] drop-shadow-[0_0_5px_#4CC9FF]">
        Audio Data Source
      </h2>

      {(loading || fastLoading) && (
        <div className="text-sm opacity-70 animate-pulse">
          {loading ? "Loading audio files..." : "Loading audio metadata..."}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {itemList.length > 0 ? (
          itemList.map((f) => {
            const fast = getFastData(f.key);

            const summary = fast?.summary ?? "No summary available";
            const audio = fast?.audio_data;

            return (
              <div key={f.key}>
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
                  {/* AUDIO PLAYER */}
                  <div
                    className="
                      w-full md:w-1/3 rounded-lg 
                      shadow-inner border border-[#1C2F4A] bg-black/40 p-4
                    "
                  >
                    <audio
                      controls
                      src={f.url}
                      className="w-full"
                    ></audio>
                  </div>

                  {/* INFO DISPLAY */}
                  <div className="mt-3 text-sm text-[#D6E6F6] space-y-3 md:w-2/3">
                    {fast ? (
                      <>
                        <div>
                          <h4 className="text-xs font-semibold text-[#9FD7FF]">
                            File Details
                          </h4>
                          <div className="mt-2 text-xs space-y-1">
                            <div>
                              <strong>File Name:</strong>{" "}
                              {fast.file_name ?? "-"}
                            </div>
                            <div>
                              <strong>Type:</strong> {fast.file_type ?? "-"}
                            </div>
                            <div>
                              <strong>Timestamp:</strong>{" "}
                              {new Date(fast.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold text-[#9FD7FF]">
                            Audio Data
                          </h4>
                          <div className="mt-2 text-xs space-y-1">
                            <div>
                              <strong>Transcription:</strong>{" "}
                              {audio?.transcription ?? "N/A"}
                            </div>
                            <div>
                              <strong>Emotion:</strong>{" "}
                              {audio?.emotion ?? "N/A"}
                            </div>
                            <div>
                              <strong>Keywords:</strong>{" "}
                              {audio?.keywords?.join(", ") ?? "N/A"}
                            </div>
                            <div>
                              <strong>Language:</strong>{" "}
                              {audio?.language ?? "N/A"}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold text-[#9FD7FF]">
                            Summary
                          </h4>
                          <p className="mt-1 text-xs opacity-80">{summary}</p>
                        </div>
                      </>
                    ) : (
                      <div className="text-red-400">
                        <strong>
                          No metadata for this file ({f.key?.split("/").pop()})
                        </strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="h-px w-full bg-linear-to-r from-transparent via-[#1F314B] to-transparent mt-6"></div>
              </div>
            );
          })
        ) : (
          <div className="text-xs opacity-60">No audio files uploaded yet.</div>
        )}
      </div>
    </div>
  );
}
