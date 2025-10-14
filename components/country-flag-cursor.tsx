"use client"

import { useEffect, useState } from "react"

function codeToFlagEmoji(code: string) {
  const cc = code.trim().toUpperCase()
  if (!/^[A-Z]{2}$/.test(cc)) return "🌐"
  return String.fromCodePoint(...[...cc].map((c) => 0x1f1e6 - 65 + c.charCodeAt(0)))
}

export function CountryFlagCursor() {
  const [flag, setFlag] = useState("🌐")
  const [pos, setPos] = useState({ x: -1000, y: -1000 })

  useEffect(() => {
    let mounted = true
    async function loadCountry() {
      try {
        const r = await fetch("/api/geo", { cache: "no-store" })
        if (!r.ok) throw new Error("geo failed")
        const data = (await r.json()) as { country?: string }
        if (mounted) setFlag(codeToFlagEmoji(data.country || ""))
      } catch {
        // best-effort fallback to globe
        if (mounted) setFlag("🌐")
      }
    }
    loadCountry()
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      setPos({ x: e.clientX + 10, y: e.clientY + 14 })
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      mounted = false
      window.removeEventListener("pointermove", onMove)
    }
  }, [])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-50 select-none text-base md:text-lg"
      style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }}
    >
      <div className="rounded-md bg-background/70 px-1.5 py-0.5 shadow backdrop-blur">{flag}</div>
    </div>
  )
}
