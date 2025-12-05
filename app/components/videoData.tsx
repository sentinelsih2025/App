"use client"

import { useEffect, useState, useRef } from 'react'

type FileItem = { key?: string; url?: string; lastModified?: string | null }

export default function TextData() {
    const [files, setFiles] = useState<FileItem[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loadErrors, setLoadErrors] = useState<Record<string, string>>({})
    const mountedRef = useRef(true)

    async function fetchFiles() {
        try {
            setLoading(true)
            const res = await fetch('/api/files?type=video')
            if (!mountedRef.current) return

            const contentType = res.headers.get('content-type') || ''

            if (!contentType.includes('application/json')) {
                const body = await res.text()
                const snippet = body?.slice(0, 1000) || ''
                setError(`Unexpected content-type: ${contentType}. Response: ${snippet}`)
                setFiles([])
            } else {
                const json = await res.json()
                console.log('VideoData API response:', json)
                if (!res.ok) {
                    setError(json?.error || 'Failed to load files')
                    setFiles([])
                } else {
                    const now = Date.now()
                    const dayAgo = now - 24 * 60 * 60 * 1000
                    const rawFiles: FileItem[] = json?.files || []
                    console.log('Raw video files:', rawFiles)

                    const recent = rawFiles.filter(it => {
                        if (!it?.lastModified) return false
                        const t = new Date(it.lastModified).getTime()
                        return !Number.isNaN(t) && t >= dayAgo
                    })

                    console.log('Recent videos (within 24h):', recent)
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
        fetchFiles()

        const handler = async (e: Event) => {
            const detail = (e as CustomEvent)?.detail
            const key = detail?.key

            if (key) {
                try {
                    const res = await fetch(`/api/files?key=${encodeURIComponent(key)}`)
                    if (!res.ok) return
                    const json = await res.json()
                    const file = json.files?.[0] || null

                    if (file) {
                        if (!/\.(mp4|webm|mov|avi|mkv|flv|wmv)$/i.test(file.key || '')) return

                        const now = Date.now()
                        const dayAgo = now - 24 * 60 * 60 * 1000
                        const t = new Date(file.lastModified || '').getTime()

                        if (!Number.isNaN(t) && t >= dayAgo) {
                            setFiles(prev => {
                                const existing = (prev || []).filter(p => p.key !== file.key)
                                return [file, ...existing]
                            })
                        }
                    }
                } catch (err) {
                    console.warn('Failed to fetch single file', err)
                }
                return
            }

            fetchFiles()
        }

        window.addEventListener('images-updated', handler)
        return () => {
            mountedRef.current = false
            window.removeEventListener('images-updated', handler)
        }
    }, [])

    return (
        <div className="bg-[linear-gradient(90deg,rgba(255,255,255,0.25),rgba(255,255,255,0.50),rgba(255,255,255,0.25))] rounded-xl p-4 border border-[#ffffff] h-64 shrink-0 flex flex-col gap-2">
            <p className="text-sm">Video Feed</p>

            <div className="mt-2 w-full h-full bg-black/60 p-2 rounded-lg border border-[#1E2A3E] text-xs opacity-90 overflow-hidden">
                {loading && (
                    <div className="w-full h-full flex items-center justify-center opacity-60">Loading videos…</div>
                )}

                {!loading && error && (
                    <div className="w-full h-full flex items-center justify-center text-red-400">{error}</div>
                )}

                {!loading && !error && files && files.length === 0 && (
                    <div className="w-full h-full flex items-center justify-center opacity-40">No recent videos</div>
                )}

                {!loading && !error && files && files.length > 0 && (
                    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full p-1">
                        {(() => {
                            const maxVisible = 4
                            const visible = files.slice(0, maxVisible)
                            const extra = Math.max(0, files.length - maxVisible)

                            return visible.map((f, idx) => (
                                <div key={f.key} className="relative w-full bg-black/60 rounded overflow-hidden flex items-center justify-center">
                                    {f.url ? (
                                        <video
                                            src={f.url}
                                            controls
                                            className="w-full h-full object-cover"
                                            onError={() => {
                                                setLoadErrors(prev => ({
                                                    ...prev,
                                                    [String(f.key)]: 'failed to load video'
                                                }))
                                            }}
                                        />
                                    ) : (
                                        <div className="opacity-60">No preview</div>
                                    )}

                                    {idx === maxVisible - 1 && extra > 0 && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <div className="text-white text-lg font-semibold bg-black/40 px-3 py-1 rounded">
                                                +{extra}
                                            </div>
                                        </div>
                                    )}

                                    {loadErrors[String(f.key)] && (
                                        <div className="absolute inset-0 flex items-center justify-center text-red-300 bg-black/50">
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
