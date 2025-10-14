"use client"

import { useEffect, useRef, useState } from "react"

function codeToFlagEmoji(code: string) {
  const cc = code.trim().toUpperCase()
  if (!/^[A-Z]{2}$/.test(cc)) return "🌐"
  return String.fromCodePoint(...[...cc].map((c) => 0x1f1e6 - 65 + c.charCodeAt(0)))
}

export function CountryFlagCursor() {
  const [flag, setFlag] = useState("🌐")
  const elRef = useRef<HTMLDivElement | null>(null)

  // initial offscreen position
  useEffect(() => {
    if (elRef.current) {
      elRef.current.style.left = `-1000px`
      elRef.current.style.top = `-1000px`
    }
  }, [])

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
      // position the flag at the trailing/right edge of the cursor; tweak offsets as needed
      const offsetX = 3
      const offsetY = 8
      if (elRef.current) {
        // place element such that its left edge aligns with cursor + offsetX
        elRef.current.style.transform = `none`
        elRef.current.style.left = `${e.clientX + offsetX}px`
        elRef.current.style.top = `${e.clientY + offsetY}px`
      }
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
      ref={elRef}
      className="pointer-events-none fixed z-50 select-none text-base md:text-lg"
      style={{ transform: "none" }}
    >
      <div className="rounded-md bg-background/70 px-1.5 py-0.5 shadow backdrop-blur will-change-transform">{flag}</div>
    </div>
  )
}
