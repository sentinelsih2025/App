"use client"

import { useState, useMemo, useEffect } from "react"
import useSWR, { mutate } from "swr"

type FileItem = { key?: string; url?: string; lastModified?: string | null }

// --- FETCHER ---
const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to load image files")
    return res.json()
}

export default function ImageData() {
    // 1. STATE for specific image render errors (local state is best for this)
    const [loadErrors, setLoadErrors] = useState<Record<string, string>>({})

    // 2. SWR HOOK (Auto-polls every 3 seconds)
    const { data: json, error, isLoading } = useSWR(
        '/api/files?type=image',
        fetcher,
        {
            refreshInterval: 3000,
            revalidateOnFocus: true
        }
    )

    // 3. EVENT LISTENER (Kept for upload compatibility)
    // When an upload finishes, we just trigger a re-fetch of the whole list
    useEffect(() => {
        const handler = () => mutate('/api/files?type=image');
        if (typeof window !== "undefined") {
            window.addEventListener("images-updated", handler)
            return () => window.removeEventListener("images-updated", handler)
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
                // Filter out older than 24h and invalid dates
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
            <p className="text-sm opacity-60">Image Feed</p>

            <div className="mt-2 w-full h-full bg-black/60 p-2 rounded-lg border border-[#1E2A3E] text-xs opacity-90 overflow-hidden">
                
                {/* LOADING STATE */}
                {isLoading && (
                    <div className="w-full h-full flex items-center justify-center text-xs opacity-60">
                        Loading images...
                    </div>
                )}

                {/* ERROR STATE */}
                {error && (
                    <div className="w-full h-full text-center flex items-center justify-center text-xs text-red-400">
                        Failed to load feed
                    </div>
                )}

                {/* EMPTY STATE */}
                {!isLoading && !error && files.length === 0 && (
                    <div className="w-full h-full text-center flex items-center justify-center text-xs opacity-40">
                        No uploaded images (24h)
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
                                <div key={f.key} className="relative w-full bg-black/60 rounded overflow-hidden flex items-center justify-center">
                                    {f.url ? (
                                        <a href={`/image?key=${encodeURIComponent(f.key ?? '')}`} className="block w-full h-full">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img 
                                                src={f.url} 
                                                alt={String(f.key)} 
                                                className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                                                onError={async () => {
                                                    // Detailed error probing logic preserved
                                                    setLoadErrors((prev) => ({ ...prev, [String(f.key)]: 'failed to load image' }))
                                                    try {
                                                        const probe = await fetch(String(f.url), { method: 'GET', mode: 'cors' })
                                                        if (!probe.ok) {
                                                            setLoadErrors((prev) => ({ ...prev, [String(f.key)]: `HTTP ${probe.status}` }))
                                                        } else {
                                                            setLoadErrors((prev) => ({ ...prev, [String(f.key)]: 'Render error' }))
                                                        }
                                                    } catch (err) {
                                                        setLoadErrors((prev) => ({ ...prev, [String(f.key)]: 'Network/CORS Error' }))
                                                    }
                                                }}
                                            />
                                        </a>
                                    ) : (
                                        <div className="text-xs opacity-60">No preview</div>
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
                                        <div className="absolute inset-0 flex items-center justify-center text-xs text-red-300 bg-black/80 p-1 text-center">
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