"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Tab = "github" | "linkedin" | "x" | "instagram" | "telegram"

const tabs: { key: Tab; label: string }[] = [
  { key: "github", label: "GitHub" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "x", label: "X" },
  { key: "instagram", label: "Instagram" },
  { key: "telegram", label: "Telegram" },
]

export function PhoneSocials() {
  const [tab, setTab] = useState<Tab>("github")

  return (
    <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
      <div className="w-full md:w-2/3">
        <div className="mx-auto h-[520px] w-[260px] rounded-[32px] border border-border bg-card p-3 shadow-sm">
          <div className="mx-auto mb-2 h-1.5 w-20 rounded-full bg-muted" />
          <div className="relative h-[470px] overflow-hidden rounded-2xl border border-border bg-background">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="h-full w-full"
              >
                {tab === "github" && <GithubPreview />}
                {tab === "linkedin" && <LinkedInPreview />}
                {tab === "x" && <XPreview />}
                {tab === "instagram" && <InstagramPreview />}
                {tab === "telegram" && <TelegramPreview />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/3">
        <div className="grid grid-cols-3 gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`h-9 rounded-md border border-input px-2 text-xs hover:bg-accent hover:text-accent-foreground ${
                tab === t.key ? "bg-accent text-accent-foreground" : "bg-background"
              }`}
              aria-pressed={tab === t.key}
              aria-label={`Open ${t.label}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Tap inside the phone to open the real profile.</p>
      </div>
    </div>
  )
}

function OpenLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Open external link"
    >
      {children}
    </a>
  )
}

function GithubPreview() {
  return (
    <OpenLink href="https://github.com/teja-pola">
      <div className="flex h-full flex-col">
        <header className="flex items-center gap-2 border-b px-3 py-2">
          <div className="h-5 w-5 rounded bg-foreground" />
          <span className="text-sm font-medium">GitHub</span>
        </header>
        <div className="p-3 text-sm">
          <p className="font-medium">teja-pola</p>
          <p className="text-muted-foreground">AI + Full‑stack projects</p>
          <div className="mt-3 space-y-2">
            <div className="rounded-md border p-2">
              <p className="text-sm font-medium">Cartify</p>
              <p className="text-xs text-muted-foreground">AI shopping agent (Groq + Supabase)</p>
            </div>
            <div className="rounded-md border p-2">
              <p className="text-sm font-medium">Zesty</p>
              <p className="text-xs text-muted-foreground">Unrecommendation Engine (Qloo + LLM)</p>
            </div>
            <div className="rounded-md border p-2">
              <p className="text-sm font-medium">Zeo</p>
              <p className="text-xs text-muted-foreground">AI mental health companion</p>
            </div>
          </div>
        </div>
      </div>
    </OpenLink>
  )
}

function LinkedInPreview() {
  return (
    <OpenLink href="https://www.linkedin.com/in/dharmatejapola">
      <div className="flex h-full flex-col">
        <header className="flex items-center gap-2 border-b px-3 py-2">
          <div className="h-5 w-5 rounded bg-sky-600" />
          <span className="text-sm font-medium">LinkedIn</span>
        </header>
        <div className="p-3 text-sm">
          <p className="font-medium">Dharma Teja Pola</p>
          <p className="text-xs text-muted-foreground">Full‑Stack AI Developer • Hackathon winner</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
            <li>Parul University — Software Engineer Intern</li>
            <li>AI Agents, RAG, Cloud</li>
          </ul>
        </div>
      </div>
    </OpenLink>
  )
}

function XPreview() {
  return (
    <OpenLink href="https://x.com/tejapola">
      <div className="flex h-full flex-col">
        <header className="flex items-center gap-2 border-b px-3 py-2">
          <div className="h-5 w-5 rounded bg-black" />
          <span className="text-sm font-medium">X</span>
        </header>
        <div className="p-3 text-sm">
          <p className="text-muted-foreground">Threads on AI, projects, and shipping.</p>
        </div>
      </div>
    </OpenLink>
  )
}

function InstagramPreview() {
  return (
    <OpenLink href="https://www.instagram.com/teja.techh/">
      <div className="flex h-full flex-col">
        <header className="flex items-center gap-2 border-b px-3 py-2">
          <div className="h-5 w-5 rounded bg-pink-600" />
          <span className="text-sm font-medium">Instagram</span>
        </header>
        <div className="p-3 text-sm">
          <p className="text-muted-foreground">Snippets of builds, campus life, and creativity.</p>
        </div>
      </div>
    </OpenLink>
  )
}

function TelegramPreview() {
  return (
    <OpenLink href="https://t.me/tejapola">
      <div className="flex h-full flex-col">
        <header className="flex items-center gap-2 border-b px-3 py-2">
          <div className="h-5 w-5 rounded bg-sky-500" />
          <span className="text-sm font-medium">Telegram</span>
        </header>
        <div className="p-3 text-sm">
          <p className="text-muted-foreground">Reach me quickly on Telegram.</p>
        </div>
      </div>
    </OpenLink>
  )
}
