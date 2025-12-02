

"use client"

import { useEffect, useState } from 'react'

type FileItem = { key?: string; url?: string }

export default function imageData() {
    const [files, setFiles] = useState<FileItem[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loadErrors, setLoadErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        let mounted = true
        async function fetchFiles() {
            try {
                setLoading(true)
                const res = await fetch('/api/files')

                // Handle non-JSON responses gracefully — in dev Next can return
                // an HTML error document which will cause res.json() to throw.
                if (!mounted) return

                const contentType = res.headers.get('content-type') || ''

                if (!contentType.includes('application/json')) {
                    // read text so we can surface a helpful message
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
                        setFiles(json?.files || [])
                    }
                }
            } catch (err) {
                if (!mounted) return
                setError((err as Error).message || String(err))
                setFiles([])
            } finally {
                if (mounted) setLoading(false)
            }
        }

        fetchFiles()

        return () => { mounted = false }
    }, [])

    return (
        <div className="bg-[#111929] rounded-xl p-4 border border-[#1E2A3E] h-56 shrink-0 flex flex-col gap-2">
            <p className="text-sm opacity-60">Image Feed</p>

            <div className="mt-2 w-full h-full bg-black/40 p-2 rounded-lg border border-[#1E2A3E] text-xs opacity-90 overflow-hidden">
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
                    <div className="grid grid-cols-2 gap-2 h-full overflow-auto p-1">
                        {files.map((f) => (
                            <div key={f.key} className="relative w-full h-24 bg-black/60 rounded overflow-hidden flex items-center justify-center">
                                {f.url ? (
                                    <a href={`/image?key=${encodeURIComponent(f.key ?? '')}`} className="block w-full h-full">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={f.url} alt={String(f.key)} className="object-cover w-full h-full"
                                                onError={async (e) => {
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
                                {loadErrors[String(f.key)] && (
                                    <div className="absolute inset-0 flex items-center justify-center text-xs text-red-300 bg-black/50">{loadErrors[String(f.key)]}</div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}