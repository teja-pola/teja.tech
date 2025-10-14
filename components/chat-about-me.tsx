"use client"

import type React from "react"

import { useState } from "react"

export function ChatAboutMe() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function ask(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setAnswer(null)
    if (!question.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/ask-me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")
      setAnswer(data.answer)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border">
      <form onSubmit={ask} className="flex items-center gap-2 border-b p-3">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about my work, projects, or skills..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          aria-label="Ask a question"
        />
        <button
          className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-xs text-primary-foreground disabled:opacity-50"
          disabled={loading}
          type="submit"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
      <div className="p-3 text-sm">
        {error ? <p className="text-destructive">{error}</p> : null}
        {answer ? (
          <p className="whitespace-pre-wrap">{answer}</p>
        ) : (
          <p className="text-muted-foreground">Answers are generated only from my public info and resume.</p>
        )}
      </div>
    </div>
  )
}
