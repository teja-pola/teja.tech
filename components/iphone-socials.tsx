"use client"
import { useState } from "react"
import Link from "next/link"

type Tab = "linkedin" | "github" | "x" | "instagram"

const tabs: { key: Tab; label: string; href: string }[] = [
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/dharmatejapola" },
  { key: "github", label: "GitHub", href: "https://github.com/teja-pola" },
  { key: "x", label: "X (Twitter)", href: "https://x.com/" },
  { key: "instagram", label: "Instagram", href: "https://instagram.com/" },
]

export function IPhoneSocials() {
  const [active, setActive] = useState<Tab>("linkedin")

  return (
    <div className="mx-auto w-[280px] md:w-[340px]">
      <div className="relative rounded-[3rem] glass supports-[backdrop-filter]:bg-background/20">
        <div className="absolute inset-0 rounded-[3rem] ring-1 ring-white/10" />
        <div className="absolute left-1/2 top-1 h-6 w-36 -translate-x-1/2 rounded-b-2xl bg-black/80 dark:bg-black/90" />
        <div className="aspect-[1125/2436] overflow-hidden rounded-[2.7rem] p-3">
          <div className="relative h-full w-full rounded-[2.2rem] border border-white/10 bg-gradient-to-b from-background/50 to-background/70">
            <div className="flex items-center justify-between px-4 pt-3 text-[10px] text-muted-foreground/80">
              <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              <div className="flex items-center gap-1">
                <span aria-hidden className="inline-block h-[7px] w-[7px] rounded-full bg-emerald-400/80" />
                <span aria-hidden className="inline-block h-[7px] w-[12px] rounded-sm bg-emerald-400/60" />
                <span aria-hidden className="inline-block h-[7px] w-[16px] rounded-sm bg-emerald-400/40" />
              </div>
            </div>

            <div className="flex h-[88%] flex-col items-center justify-center p-4 text-center">
              {active === "linkedin" && (
                <div className="space-y-2">
                  <div className="rounded-xl border border-white/10 bg-background/60 p-3">
                    <div className="text-sm font-semibold">LinkedIn profile</div>
                    <div className="text-xs text-muted-foreground">Professional updates and experience</div>
                  </div>
                </div>
              )}
              {active === "github" && (
                <div className="space-y-2">
                  <div className="rounded-xl border border-white/10 bg-background/60 p-3">
                    <div className="text-sm font-semibold">GitHub</div>
                    <div className="text-xs text-muted-foreground">Projects, repos, and contributions</div>
                  </div>
                </div>
              )}
              {active === "x" && (
                <div className="space-y-2">
                  <div className="rounded-xl border border-white/10 bg-background/60 p-3">
                    <div className="text-sm font-semibold">X (Twitter)</div>
                    <div className="text-xs text-muted-foreground">Threads and thoughts</div>
                  </div>
                </div>
              )}
              {active === "instagram" && (
                <div className="space-y-2">
                  <div className="rounded-xl border border-white/10 bg-background/60 p-3">
                    <div className="text-sm font-semibold">Instagram</div>
                    <div className="text-xs text-muted-foreground">Visuals and moments</div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative flex h-[8%] items-center justify-between gap-2 rounded-b-[2.2rem] border-t border-white/10 bg-background/60 px-2">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  className={`flex-1 rounded-lg px-2 py-1 text-xs transition ${
                    active === t.key ? "bg-white/10 text-foreground" : "text-muted-foreground hover:bg-white/5"
                  }`}
                  aria-pressed={active === t.key}
                >
                  {t.label}
                </button>
              ))}
              <Link
                href={tabs.find((t) => t.key === active)!.href}
                target="_blank"
                className="ml-1 whitespace-nowrap rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-xs text-foreground hover:bg-white/20 transition"
                aria-label="Open selected social"
              >
                Open
              </Link>
              <div className="home-indicator" aria-hidden />
            </div>
          </div>
        </div>
        <div className="absolute right-[-3px] top-20 h-8 w-[3px] rounded-l bg-white/20" />
        <div className="absolute right-[-3px] top-36 h-16 w-[3px] rounded-l bg-white/20" />
        <div className="absolute left-[-3px] top-28 h-10 w-[3px] rounded-r bg-white/20" />
      </div>
    </div>
  )
}
