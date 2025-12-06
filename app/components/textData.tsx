"use client"

import { useMemo, useEffect } from "react"
import useSWR, { mutate } from "swr"

type FileItem = { key?: string; url?: string; lastModified?: string | null }

// --- FETCHER ---
const fetcher = async (url: string) => {
    const res = await fetch(url)
    // Basic error handling
    if (!res.ok) {
        const contentType = res.headers.get("content-type") || ""
        if (contentType.includes("application/json")) {
            const json = await res.json()
            throw new Error(json.error || "Failed to fetch")
        }
        throw new Error("Server error")
    }
    return res.json()
}

export default function TextData() {
    // 1. CONSTANTS
    const textRegex = /\.(txt|md|json|yaml|yml|log)$/i

    // 2. SWR HOOK (Auto-polls every 3 seconds)
    const { data: json, error, isLoading } = useSWR(
        '/api/files?type=text',
        fetcher,
        {
            refreshInterval: 3000,
            revalidateOnFocus: true
        }
    )

    // 3. EVENT LISTENER
    // When a text file is uploaded elsewhere, force a refresh
    useEffect(() => {
        const handler = () => mutate('/api/files?type=text');
        if (typeof window !== "undefined") {
            window.addEventListener("texts-updated", handler)
            return () => window.removeEventListener("texts-updated", handler)
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
                // Check extension
                if (!it.key || !textRegex.test(it.key)) return false
                
                // Check date
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
            <p className="text-sm opacity-60">Text Feed</p>

            <div className="mt-2 w-full h-full bg-black/60 p-2 rounded-lg border border-[#1E2A3E] text-xs opacity-90 overflow-hidden">
                
                {/* LOADING */}
                {isLoading && (
                    <div className="w-full h-full flex items-center justify-center opacity-60 animate-pulse">
                        Loading text...
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
                        No recent text files
                    </div>
                )}

                {/* DATA GRID */}
                {!isLoading && !error && files.length > 0 && (
                    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
                        {(() => {
                            const maxVisible = 4
                            const visible = files.slice(0, maxVisible)
                            const extra = Math.max(0, files.length - maxVisible)

                            return visible.map((f, idx) => (
                                <a
                                    key={f.key}
                                    href={`/text?key=${encodeURIComponent(f.key ?? "")}`}
                                    className="relative bg-black/50 rounded p-2 flex items-center justify-center border border-[#1E2A3E] hover:bg-black/40 transition group"
                                >
                                    {/* Icon & Filename */}
                                    <div className="text-center px-1 flex flex-col items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px] text-gray-500 group-hover:text-blue-400">description</span>
                                        <div className="text-xs break-all line-clamp-2">
                                            {f.key}
                                        </div>
                                    </div>

                                    {/* "+X More" Overlay */}
                                    {idx === maxVisible - 1 && extra > 0 && (
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                                            <div className="text-white text-lg font-semibold bg-black/40 px-3 py-1 rounded border border-white/10">
                                                +{extra}
                                            </div>
                                        </div>
                                    )}
                                </a>
                            ))
                        })()}
                    </div>
                )}
            </div>
        </div>
    )
}