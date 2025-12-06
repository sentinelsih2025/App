"use client"

import { useState, useMemo, useEffect } from "react"
import useSWR, { mutate } from "swr"

type FileItem = { key?: string; url?: string; lastModified?: string | null }

// --- FETCHER ---
const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to load video files")
    return res.json()
}

export default function VideoData() {
    // 1. STATE for video load errors
    const [loadErrors, setLoadErrors] = useState<Record<string, string>>({})

    // 2. SWR HOOK (Auto-polls every 3 seconds)
    const { data: json, error, isLoading } = useSWR(
        '/api/files?type=video',
        fetcher,
        {
            refreshInterval: 3000,
            revalidateOnFocus: true
        }
    )

    // 3. EVENT LISTENER
    // Listens for 'videos-updated' to trigger immediate refresh
    useEffect(() => {
        const handler = () => mutate('/api/files?type=video');
        if (typeof window !== "undefined") {
            window.addEventListener("videos-updated", handler)
            return () => window.removeEventListener("videos-updated", handler)
        }
    }, [])

    // 4. DATA TRANSFORMATION
    const files = useMemo(() => {
        if (!json?.files) return []

        const now = Date.now()
        const dayAgo = now - 24 * 60 * 60 * 1000
        const videoRegex = /\.(mp4|webm|mov|avi|mkv|flv|wmv)$/i
        const rawFiles: FileItem[] = json.files

        return rawFiles
            .filter((it) => {
                // Check extension
                if (!it.key || !videoRegex.test(it.key)) return false
                
                // Check date (24h window)
                if (!it.lastModified) return false
                const t = new Date(it.lastModified).getTime()
                return !Number.isNaN(t) && t >= dayAgo
            })
            .sort((a, b) => {
                // Sort Newest First
                const ta = a.lastModified ? new Date(a.lastModified).getTime() : 0
                const tb = b.lastModified ? new Date(b.lastModified).getTime() : 0
                return tb - ta
            })
    }, [json])

    // 5. UI RENDER
    return (
        <div className="bg-[linear-gradient(90deg,rgba(255,255,255,0.25),rgba(255,255,255,0.50),rgba(255,255,255,0.25))] rounded-xl p-4 border border-[#ffffff] h-64 shrink-0 flex flex-col gap-2">
            <p className="text-sm opacity-60">Video Feed</p>

            <div className="mt-2 w-full h-full bg-black/60 p-2 rounded-lg border border-[#1E2A3E] text-xs opacity-90 overflow-hidden">
                
                {/* LOADING */}
                {isLoading && (
                    <div className="w-full h-full flex items-center justify-center opacity-60 animate-pulse">
                        Loading videos...
                    </div>
                )}

                {/* ERROR */}
                {error && (
                    <div className="w-full h-full text-center flex items-center justify-center text-red-400">
                        Connection Failed
                    </div>
                )}

                {/* EMPTY */}
                {!isLoading && !error && files.length === 0 && (
                    <div className="w-full h-full text-center flex items-center justify-center opacity-40">
                        No recent videos (24h)
                    </div>
                )}

                {/* DATA GRID */}
                {!isLoading && !error && files.length > 0 && (
                    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full p-1">
                        {(() => {
                            const maxVisible = 4
                            const visible = files.slice(0, maxVisible)
                            const extra = Math.max(0, files.length - maxVisible)

                            return visible.map((f, idx) => (
                                <div key={f.key} className="relative w-full bg-black/60 rounded overflow-hidden flex items-center justify-center border border-[#1E2A3E]">
                                    {f.url ? (
                                        <video
                                            src={f.url}
                                            controls
                                            className="w-full h-full object-cover"
                                            onError={() => {
                                                setLoadErrors(prev => ({
                                                    ...prev,
                                                    [String(f.key)]: 'Failed to load video'
                                                }))
                                            }}
                                        />
                                    ) : (
                                        <div className="opacity-60">No preview</div>
                                    )}

                                    {/* "+X More" Overlay */}
                                    {idx === maxVisible - 1 && extra > 0 && (
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                                            <div className="text-white text-lg font-semibold bg-black/40 px-3 py-1 rounded border border-white/10">
                                                +{extra}
                                            </div>
                                        </div>
                                    )}

                                    {/* Error Overlay */}
                                    {loadErrors[String(f.key)] && (
                                        <div className="absolute inset-0 flex items-center justify-center text-xs text-red-300 bg-black/80 text-center p-1">
                                            {loadErrors[String(f.key)]}
                                        </div>
                                    )}
                                </div>

                                
                            ))
                        })()}
                    </div>
                )}
            </div>
        </div>
    )
}