"use client"

import { useState, useMemo, useEffect } from "react"
import useSWR, { mutate } from "swr"

type FileItem = { key?: string; url?: string; lastModified?: string | null }

// --- FETCHER ---
const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to load audio files")
    return res.json()
}

export default function AudioData() {
    // 1. STATE for specific media render errors
    const [loadErrors, setLoadErrors] = useState<Record<string, string>>({})

    // 2. SWR HOOK (Auto-polls every 3 seconds)
    const { data: json, error, isLoading } = useSWR(
        '/api/files?type=audio', // <--- Changed to audio
        fetcher,
        {
            refreshInterval: 3000,
            revalidateOnFocus: true
        }
    )

    // 3. EVENT LISTENER
    useEffect(() => {
        const handler = () => mutate('/api/files?type=audio'); // <--- Changed to audio
        if (typeof window !== "undefined") {
            window.addEventListener("audio-updated", handler) // <--- Changed event name
            return () => window.removeEventListener("audio-updated", handler)
        }
    }, [])

    // 4. DATA TRANSFORMATION (Filter 24h & Sort)
    const files = useMemo(() => {
        if (!json?.files) return []

        const now = Date.now()
        const dayAgo = now - 24 * 60 * 60 * 1000
        const rawFiles: FileItem[] = json.files

        return rawFiles
            .filter((it) => {
                if (!it?.lastModified) return false
                const t = new Date(it.lastModified).getTime()
                return !Number.isNaN(t) && t >= dayAgo
            })
            .sort((a, b) => {
                const ta = a.lastModified ? new Date(a.lastModified).getTime() : 0
                const tb = b.lastModified ? new Date(b.lastModified).getTime() : 0
                return tb - ta
            })
    }, [json])

    // 5. UI RENDER
    return (
      <div className="bg-[linear-gradient(90deg,rgba(255,255,255,0.15),rgba(255,255,255,0.30),rgba(255,255,255,0.15))] rounded-xl p-4 border border-[#ffffff]/30 h-72 shrink-0 flex flex-col shadow-lg backdrop-blur-md">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-semibold text-white tracking-wide">Audio Feed</p>
                <span className="text-[10px] bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded-full border border-blue-500/30">
                    Live
                </span>
            </div>

            {/* List Container */}
            <div className="flex-1 bg-black/40 rounded-lg border border-[#1E2A3E] overflow-hidden relative">
                
                {/* LOADING */}
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/60">
                        <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                        <span className="text-xs">Syncing Feed...</span>
                    </div>
                )}

                {/* ERROR */}
                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-red-300">
                        <span className="material-symbols-outlined mb-1">wifi_off</span>
                        <span className="text-xs">Connection Failed</span>
                    </div>
                )}

                {/* EMPTY */}
                {!isLoading && !error && files.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40">
                        <span className="material-symbols-outlined mb-1 text-2xl">mic_off</span>
                        <span className="text-xs">No audio recorded (24h)</span>
                    </div>
                )}

                {/* SCROLLABLE LIST */}
                {!isLoading && !error && files.length > 0 && (
                    <div className="h-full overflow-y-auto p-2 space-y-2 pr-1 custom-scrollbar">
                        {files.map((f) => (
                            <div 
                                key={f.key} 
                                className="bg-black/60 p-3 rounded border border-white/5 hover:border-blue-400/50 transition-colors group"
                            >
                                {/* File Info Row */}
                                <div className="flex justify-between items-start mb-2">
                                    <a 
                                        href={`/audio?key=${encodeURIComponent(f.key ?? "")}`} 
                                        className="text-xs text-blue-300 font-medium truncate w-[70%] hover:underline hover:text-blue-200"
                                        title={f.key}
                                    >
                                        {f.key?.split('/').pop()}
                                    </a>
                                    <span className="text-[10px] text-gray-500">
                                        {new Date(f.lastModified || "").toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>

                                {/* Audio Player */}
                                {f.url ? (
                                    <audio 
                                        controls 
                                        preload="none" 
                                        className="w-full h-8 block rounded bg-[#05080F]"
                                        onError={() => setLoadErrors(p => ({...p, [String(f.key)]: "Error"}))}
                                    >
                                        <source src={f.url} />
                                    </audio>
                                ) : (
                                    <div className="text-[10px] text-gray-500 italic">Audio unavailable</div>
                                )}

                                {/* Error Message */}
                                {loadErrors[String(f.key)] && (
                                    <div className="text-[10px] text-red-400 mt-1">Failed to load audio source</div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}