"use client"

import { useEffect, useState, useRef } from "react"

type FileItem = { key?: string; url?: string; lastModified?: string | null }

export default function textData() {
    const [files, setFiles] = useState<FileItem[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const mountedRef = useRef(true)

    // Allowed text files
    const textRegex = /\.(txt|md|json|yaml|yml|log)$/i

    async function fetchFiles() {
        try {
            setLoading(true)
            const res = await fetch("/api/files?type=text")

            if (!mountedRef.current) return

            const contentType = res.headers.get("content-type") || ""

            if (!contentType.includes("application/json")) {
                const body = await res.text()
                const snippet = body?.slice(0, 600) || ""
                setError(
                    `Unexpected response type: ${contentType}. Server returned: ${snippet}`
                )
                setFiles([])
                return
            }

            const json = await res.json()

            if (!res.ok) {
                setError(json?.error || "Failed fetching text files")
                setFiles([])
                return
            }

            const now = Date.now()
            const dayAgo = now - 24 * 60 * 60 * 1000

            const rawFiles: FileItem[] = json?.files || []

            // Filter text files only
            const filtered = rawFiles.filter((f) => {
                if (!f.key || !textRegex.test(f.key)) return false
                if (!f.lastModified) return false
                const t = new Date(f.lastModified).getTime()
                return !Number.isNaN(t) && t >= dayAgo
            })

            // Sort newest first
            filtered.sort((a, b) => {
                const ta = a.lastModified ? new Date(a.lastModified).getTime() : 0
                const tb = b.lastModified ? new Date(b.lastModified).getTime() : 0
                return tb - ta
            })

            setFiles(filtered)
        } catch (err) {
            if (!mountedRef.current) return
            setError((err as Error).message)
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

            // Fetch single updated text file
            if (key) {
                try {
                    const res = await fetch(
                        `/api/files?key=${encodeURIComponent(key)}&type=text`
                    )
                    if (!res.ok) return
                    const json = await res.json()
                    const file = (json.files && json.files[0]) || null
                    if (!file) return

                    if (!textRegex.test(file.key || "")) return

                    const now = Date.now()
                    const dayAgo = now - 24 * 60 * 60 * 1000
                    const t = file.lastModified
                        ? new Date(file.lastModified).getTime()
                        : 0

                    if (!Number.isNaN(t) && t >= dayAgo) {
                        setFiles((prev) => {
                            const existing = (prev || []).filter((p) => p.key !== file.key)
                            return [file, ...existing]
                        })
                    }
                } catch (err) {
                    console.warn("Failed updating single text file", err)
                }

                return
            }

            // Full refresh if no specific key
            fetchFiles()
        }

        if (typeof window !== "undefined") {
            window.addEventListener("texts-updated", handler as EventListener)
        }

        return () => {
            mountedRef.current = false
            if (typeof window !== "undefined") {
                window.removeEventListener("texts-updated", handler as EventListener)
            }
        }
    }, [])

    return (
        <div className="bg-[linear-gradient(90deg,rgba(255,255,255,0.25),rgba(255,255,255,0.50),rgba(255,255,255,0.25))] rounded-xl p-4 border border-[#ffffff] h-64 shrink-0 flex flex-col gap-2">
            <p className="text-sm opacity-60">Text Feed</p>

            <div className="mt-2 w-full h-full bg-black/60 p-2 rounded-lg border border-[#1E2A3E] text-xs opacity-90 overflow-hidden">
                {loading && (
                    <div className="w-full h-full flex items-center justify-center opacity-60">
                        Loading text…
                    </div>
                )}

                {!loading && error && (
                    <div className="w-full h-full text-center flex items-center justify-center text-red-400">
                        {error}
                    </div>
                )}

                {!loading && !error && files && files.length === 0 && (
                    <div className="w-full h-full text-center flex items-center justify-center opacity-40">
                        No recent text files
                    </div>
                )}

                {!loading && !error && files && files.length > 0 && (
                    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
                        {(() => {
                            const maxVisible = 4
                            const visible = files.slice(0, maxVisible)
                            const extra = Math.max(0, files.length - maxVisible)

                            return visible.map((f, idx) => (
                                <a
                                    key={f.key}
                                    href={`/text?key=${encodeURIComponent(f.key ?? "")}`}
                                    className="relative bg-black/50 rounded p-2 flex items-center justify-center border border-[#1E2A3E] hover:bg-black/40 transition"
                                >
                                    <div className="text-center text-xs break-all px-1">
                                        {f.key}
                                    </div>

                                    {idx === maxVisible - 1 && extra > 0 && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <div className="text-white text-lg font-semibold bg-black/40 px-3 py-1 rounded">
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
