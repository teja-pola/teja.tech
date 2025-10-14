"use client"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = theme === "dark"
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-xl border border-white/10 bg-background/40 px-3 py-1.5 text-xs text-foreground shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/30 hover:border-white/20 transition"
    >
      {isDark ? "Light" : "Dark"}
    </button>
  )
}
