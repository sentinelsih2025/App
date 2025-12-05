

"use client"

import { useEffect, useState, useRef } from 'react'

type FileItem = { key?: string; url?: string; lastModified?: string | null }

export default function imageData() {
    const [files, setFiles] = useState<FileItem[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loadErrors, setLoadErrors] = useState<Record<string, string>>({})

    const mountedRef = useRef(true)

    // Fetch files (can be called on mount and when images-updated event fires)
    async function fetchFiles() {
        try {
            setLoading(true)
            const res = await fetch('/api/files?type=image')

            if (!mountedRef.current) return

            const contentType = res.headers.get('content-type') || ''

            if (!contentType.includes('application/json')) {
                const body = await res.text()
                const snippet = body?.slice(0, 1000) || ''
                setError(`Server returned unexpected content-type: ${contentType}. Response begins: ${snippet}`)
                setFiles([])
            } else {
                const json = await res.json()
                if (!res.ok) {
                    setError(json?.error || 'Failed to load files')
                    setFiles([])
                } else {
                    // Filter to objects uploaded within the last 24 hours
                    const now = Date.now()
                    const dayAgo = now - 24 * 60 * 60 * 1000
                    const rawFiles: FileItem[] = json?.files || []
                    const recent = rawFiles.filter((it) => {
                        if (!it?.lastModified) return false
                        const t = new Date(it.lastModified).getTime()
                        return !Number.isNaN(t) && t >= dayAgo
                    })
                    // sort newest first
                    recent.sort((a, b) => {
                        const ta = a.lastModified ? new Date(a.lastModified).getTime() : 0
                        const tb = b.lastModified ? new Date(b.lastModified).getTime() : 0
                        return tb - ta
                    })
                    setFiles(recent)
                }
            }
        } catch (err) {
            if (!mountedRef.current) return
            setError((err as Error).message || String(err))
            setFiles([])
        } finally {
            if (mountedRef.current) setLoading(false)
        }
    }

    useEffect(() => {
        // initial fetch
        fetchFiles()

        // listen for uploads elsewhere in the app

        const handler = async (e: Event) => {
            // If the event includes a specific key, fetch only that file
            const detail = (e as CustomEvent)?.detail;
            const key = detail?.key;
            if (key) {
                try {
                    const res = await fetch(`/api/files?key=${encodeURIComponent(key)}&type=image`);
                    if (!res.ok) return;
                    const json = await res.json();
                    const file = (json.files && json.files[0]) || null;
                    if (file) {
                        // Check if it's an image file
                        if (!/\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff)$/i.test(file.key || '')) {
                            return; // Skip if not an image
                        }
                        // Respect the 24-hour rule: only add if within last 24 hours
                        const now = Date.now();
                        const dayAgo = now - 24 * 60 * 60 * 1000;
                        const t = file.lastModified ? new Date(file.lastModified).getTime() : 0;
                        if (!Number.isNaN(t) && t >= dayAgo) {
                            setFiles((prev) => {
                                const existing = (prev || []).filter((p) => p.key !== file.key);
                                return [file, ...existing];
                            });
                        }
                    }
                } catch (err) {
                    console.warn('Failed to fetch single file', err);
                }
                return;
            }

            fetchFiles()
        }

        if (typeof window !== 'undefined') {
            window.addEventListener('images-updated', handler as EventListener)
        }

        return () => {
            mountedRef.current = false
            if (typeof window !== 'undefined') {
                window.removeEventListener('images-updated', handler as EventListener)
            }
        }
    }, [])

    return (
        <div className="bg-[linear-gradient(90deg,rgba(255,255,255,0.25),rgba(255,255,255,0.50),rgba(255,255,255,0.25))] rounded-xl p-4 border border-[#ffffff] h-64 shrink-0 flex flex-col gap-2">
            <p className="text-sm opacity-60">Image Feed</p>

            <div className="mt-2 w-full h-full bg-black/60 p-2 rounded-lg border border-[#1E2A3E] text-xs opacity-90 overflow-hidden">
                {loading && (
                    <div className="w-full h-full flex items-center justify-center text-xs opacity-60">Loading images…</div>
                )}

                {!loading && error && (
                    <div className="w-full h-full text-center flex items-center justify-center text-xs text-red-400">{error}</div>
                )}

                {!loading && !error && files && files.length === 0 && (
                    <div className="w-full h-full text-center flex items-center justify-center text-xs opacity-40">No uploaded images</div>
                )}

                {!loading && !error && files && files.length > 0 && (
                    // fixed 2x2 grid (no scroll) so up to 4 images are shown cleanly
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
                                            <img src={f.url} alt={String(f.key)} className="object-cover w-full h-full"
                                                onError={async () => {
                                                    // mark as failed to load in UI
                                                    setLoadErrors((prev) => ({ ...prev, [String(f.key)]: 'failed to load image' }))

                                                    try {
                                                        // attempt to fetch the URL to get a clearer error (may fail due to CORS)
                                                        const probe = await fetch(String(f.url), { method: 'GET', mode: 'cors' })
                                                        if (!probe.ok) {
                                                            setLoadErrors((prev) => ({ ...prev, [String(f.key)]: `HTTP ${probe.status}: ${probe.statusText}` }))
                                                        } else {
                                                            setLoadErrors((prev) => ({ ...prev, [String(f.key)]: 'Unknown render error (image fetched OK)' }))
                                                        }
                                                    } catch (err) {
                                                        // fetch failing is likely CORS or network issue - show message
                                                        setLoadErrors((prev) => ({ ...prev, [String(f.key)]: (err as Error).message || String(err) }))
                                                    }
                                                }}
                                            />
                                        </a>
                                    ) : (
                                        <div className="text-xs opacity-60">No preview</div>
                                    )}

                                    {/* If this is the 4th visible item and there are more, show overlay +N */}
                                    {idx === maxVisible - 1 && extra > 0 && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <div className="text-white text-lg font-semibold bg-black/40 px-3 py-1 rounded">+{extra}</div>
                                        </div>
                                    )}

                                    {loadErrors[String(f.key)] && (
                                        <div className="absolute inset-0 flex items-center justify-center text-xs text-red-300 bg-black/50">{loadErrors[String(f.key)]}</div>
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