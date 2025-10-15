"use client"
import { useEffect, useState } from "react"
import type React from "react"
import Image from "next/image"
import { Github, Linkedin, Instagram, Twitter } from "lucide-react"

type Tab = "instagram" | "linkedin" | "github" | "twitter"

const tabs: {
  key: Tab
  href: string
  icon: React.ElementType
  screen: string
  label: string
}[] = [
  {
    key: "instagram",
    href: "https://instagram.com/teja.techh",
    icon: Instagram,
    screen: "/socials/instagram.jpg",
    label: "Instagram",
  },
  {
    key: "linkedin",
    href: "https://www.linkedin.com/in/dharmatejapola",
    icon: Linkedin,
    screen: "/socials/linkedin.jpg",
    label: "LinkedIn",
  },
  {
    key: "github",
    href: "https://github.com/teja-pola",
    icon: Github,
    screen: "/socials/github.jpg",
    label: "GitHub",
  },
  {
    key: "twitter",
    href: "https://x.com/tejapola_",
    icon: Twitter,
    screen: "/socials/twitter.jpg",
    label: "Twitter",
  },
]

export function IPhoneSocials() {
  const [active, setActive] = useState<Tab>("instagram")
  const [time, setTime] = useState("")

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="mx-auto w-[280px] md:w-[340px]">
      <div className="relative rounded-[3.4rem] bg-black/70 p-1 ring-1 ring-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
        <div className="relative rounded-[3.2rem] bg-background/40 supports-[backdrop-filter]:backdrop-blur-md">
          <div className="absolute inset-0 rounded-[3.2rem] ring-1 ring-white/10 pointer-events-none" />
          <div className="absolute left-1/2 top-1 h-6 w-36 -translate-x-1/2 rounded-b-2xl bg-black/85 dark:bg-black/90" />
          <div className="aspect-[400/780] overflow-hidden rounded-[3rem] p-3">
            <div className="relative h-full w-full rounded-[2.4rem] border border-white/10 bg-black">
              <div className="flex items-center justify-between px-6 left-1 pt-3 text-[10px] text-white ">
                <span>{time || ""}</span>
                <span className="w-10 block" aria-hidden />
              </div>

              <div
                className="pointer-events-none absolute right-3 top-2 z-10 flex items-center gap-1 text-[10px] text-foreground/90"
                aria-hidden
              >
                <div className="relative h-2 w-4 rounded-[3px] border border-white/70 top-1 right-4">
                  <div className="absolute inset-y-[1px] left-[1px] w-[80%] rounded-[1px] bg-lime-600" />
                </div>
                
              </div>

              <div className="relative h-[88%] w-full select-none bg-black">
                {(() => {
                  const activeTab = tabs.find((t) => t.key === active)!
                  return (
                    <a
                      href={activeTab.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${activeTab.label} profile`}
                    >
                      <Image
                        src={activeTab.screen || "/placeholder.svg"}
                        alt={`${activeTab.label} screenshot`}
                        fill
                        className="object-contain rounded-t-[2rem]"
                        priority={false}
                      />
                    </a>
                  )
                })()}
              </div>
              <div className="relative flex h-[8%] items-center justify-between gap-1 rounded-b-[2.4rem] border-t border-white/10 bg-background/95 px-2">
                <div className="flex flex-1 items-center justify-center gap-2">
                  {tabs.map((t) => {
                    const Icon = t.icon
                    const isActive = active === t.key
                    return (
                      <button
                        key={t.key}
                        onClick={() => setActive(t.key)}
                        aria-pressed={isActive}
                        aria-label={t.label}
                        className={`grid h-8 w-10 place-items-center rounded-md transition ${
                          isActive ? "bg-white/10 text-foreground" : "text-muted-foreground hover:bg-white/5"
                        }`}
                      >
                        <Icon className="h-5 w-5 " />
                      </button>
                    )
                  })}
                </div>
                <div
                  className="pointer-events-none absolute  bottom-1 left-1/2 h-1.5 w-24 -translate-x-1/2 rounded-full bg-white/80"
                  aria-hidden
                />
              </div>
            </div>
          </div>
          <div className="absolute right-[-4px] top-28 h-16 w-[4px] rounded-l bg-white/30" />
          <div className="absolute left-[-4px] top-20 h-6 w-[4px] rounded-r bg-white/30" />
          <div className="absolute left-[-4px] top-32 h-10 w-[4px] rounded-r bg-white/30" />
          <div className="absolute left-[-4px] top-44 h-10 w-[4px] rounded-r bg-white/30" />
        </div>
      </div>
    </div>
  )
}
