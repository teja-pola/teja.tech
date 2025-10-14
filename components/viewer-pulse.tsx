"use client"

import { useEffect, useState } from "react"

export function ViewerPulse() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    const es = new EventSource("/api/viewers/stream")
    es.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data)
        if (typeof data.count === "number") setCount(data.count)
      } catch {}
    }
    es.onerror = () => {
      // ignore; server may recycle during HMR
    }
    return () => es.close()
  }, [])

  return (
    <div
      className="fixed left-4 top-4 z-40 rounded-full border border-white/10 bg-background/60 px-3 py-1.5 text-xs shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/40 md:left-6 md:top-6"
      role="status"
      aria-live="polite"
    >
      <span className="inline-flex items-center gap-2">
        <span className="relative inline-flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>
        <span className="text-foreground/90">{count === null ? "1" : count} in this UFO</span>
      </span>
    </div>
  )
}
