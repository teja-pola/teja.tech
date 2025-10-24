"use client"

import React, { useEffect, useState } from "react"

import ReactMarkdown from "react-markdown"

type PostIndex = { slug: string; title: string; path: string }

export default function BlogBlocks() {
  const [posts, setPosts] = useState<PostIndex[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [content, setContent] = useState<string>("")
  const [postTitle, setPostTitle] = useState<string | null>(null)
  const [postDate, setPostDate] = useState<string | null>(null)
  const [showEditor, setShowEditor] = useState(false)

  useEffect(() => {
    fetch('/blog/index.json')
      .then((r) => r.json())
      .then((j: PostIndex[]) => {
        setPosts(j)
        // Don't auto-select on mobile - let user choose from file list
        if (j && j.length > 0 && !active && window.innerWidth >= 768) {
          setActive((prev) => prev ?? j[0].slug)
        }
      })
  }, [])

  useEffect(() => {
    if (!active) return
    const p = posts.find((s) => s.slug === active)
    if (!p) return
    fetch(p.path)
      .then((r) => r.text())
      .then((t) => {
        // strip simple YAML frontmatter if present (---\n ... ---\n)
        let body = t
        let title: string | null = null
        let date: string | null = null
        if (t.startsWith("---")) {
          const m = t.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/)
          if (m) {
            const fm = m[1]
            body = m[2]
            // parse simple key: value pairs from frontmatter
            fm.split(/\r?\n/).forEach((line) => {
              const kv = line.match(/^([a-zA-Z0-9_\-]+):\s*(?:"([^"]+)"|'([^']+)'|(.*))$/)
              if (!kv) return
              const key = kv[1]
              const val = kv[2] ?? kv[3] ?? kv[4] ?? ""
              if (key.toLowerCase() === "title") title = String(val).trim()
              if (key.toLowerCase() === "date") date = String(val).trim()
            })
          }
        }
        // If the file is wrapped in a top-level fenced code block (e.g. ```markdown ... ```), unwrap it
        if (/^\s*(`{3,}|~{3,})/.test(body)) {
          const m2 = body.match(/^\s*(`{3,}|~{3,})[^\n]*\n([\s\S]*?)\n\1\s*$/)
          if (m2) {
            body = m2[2]
          }
        }

        setPostTitle(title)
        setPostDate(date)
        setContent(body.trim())
      })
  }, [active, posts])

  const handleFileSelect = (slug: string) => {
    setActive(slug)
    // On mobile, show editor view after file selection
    if (window.innerWidth < 768) {
      setShowEditor(true)
    }
  }

  const handleBackToFileList = () => {
    setShowEditor(false)
  }

  return (
    <div className="w-full rounded-xl overflow-hidden bg-surface/60 backdrop-blur-md border border-white/6" style={{ minHeight: 420 }}>
      {/* Mobile: Show file list by default, editor when file is selected */}
      <div className="md:hidden">
        {!showEditor ? (
          /* Mobile File List View */
          <div className="min-h-[60vh] max-h-[80vh] bg-[#0b0f14] p-4 overflow-auto">
            <div className="text-xs text-muted-foreground mb-4">FILES</div>
            <ul className="space-y-2">
              {posts.map((p) => (
                <li key={p.slug}>
                  <button
                    onClick={() => handleFileSelect(p.slug)}
                    className="w-full text-left px-3 py-3 rounded-md hover:bg-white/5 text-sm border border-white/10 hover:border-white/20 transition-colors"
                  >
                    {p.title}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6 px-3 py-3 rounded-md text-[10px] text-white/90 bg-gradient-to-r from-white/4 to-black/20 backdrop-blur-sm border border-white/6 shadow-sm text-center">
              I'm still writing - come back to see new posts.
            </div>
          </div>
        ) : (
          /* Mobile Editor View */
          <div className="h-[80vh] relative">
            {/* Back button */}
            <div className="flex items-center justify-between p-3 bg-[#0b0f14] border-b border-white/6">
              <button
                onClick={handleBackToFileList}
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                <span className="text-sm">Back</span>
              </button>
              <div className="text-xs text-muted-foreground truncate max-w-[60%]">
                {posts.find(p => p.slug === active)?.title}
              </div>
            </div>
            
            {/* Editor content */}
            <div className="h-full p-4 overflow-auto" style={{ background: 'linear-gradient(180deg, rgba(10,12,15,0.5), rgba(6,8,10,0.6))' }}>
              {active ? (
                <article className="prose prose-sm prose-invert dark:prose-invert max-w-none">
                  {postTitle ? <h1 className="text-xl font-bold mb-3">{postTitle}</h1> : null}
                  {postDate ? <div className="text-xs text-muted-foreground mb-3">{postDate}</div> : null}
                  <div className="prose prose-sm prose-invert dark:prose-invert">
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </div>
                </article>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">Loading...</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop: Traditional side-by-side layout */}
      <div className="hidden md:flex h-[80vh]">
        {/* file list (left) */}
        <aside className="w-64 lg:w-56 bg-[#0b0f14] border-r border-white/6 p-3 overflow-auto flex flex-col">
          <div className="text-xs text-muted-foreground mb-2">FILES</div>
          <ul className="space-y-1 flex-1">
            {posts.map((p) => (
              <li key={p.slug}>
                <button
                  onClick={() => setActive(p.slug)}
                  className={`w-full text-left px-2 md:px-3 py-2 rounded-md hover:bg-white/3 text-sm ${active === p.slug ? 'bg-white/5 ring-1 ring-white/10' : ''}`}
                >
                  {p.title}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <div className="px-2 md:px-3 py-2 rounded-md text-[10px] md:text-xs text-white/90 bg-gradient-to-r from-white/4 to-black/20 backdrop-blur-sm border border-white/6 shadow-sm text-center">
              I'm still writing - come back to see new posts.
            </div>
          </div>
        </aside>

        {/* editor/viewer (right) */}
        <main className="flex-1 p-4 md:p-6 overflow-auto" style={{ background: 'linear-gradient(180deg, rgba(10,12,15,0.5), rgba(6,8,10,0.6))' }}>
          {active ? (
            <article className="prose prose-sm md:prose prose-invert dark:prose-invert max-w-none">
              {postTitle ? <h1 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">{postTitle}</h1> : null}
              {postDate ? <div className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">{postDate}</div> : null}
              <div className="prose prose-sm md:prose prose-invert dark:prose-invert">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </article>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">Select a file on the left to read the post.</div>
          )}
        </main>
      </div>
    </div>
  )
}
