import { knowledge } from "@/lib/personal-knowledge"

export async function Projects() {
  const owner = "teja-pola"

  const projectKeys = ["project-cartify", "project-zesty", "project-zeo"]

  function findDoc(id: string) {
    return knowledge.find((d) => d.id === id) ?? null
  }

  // Hard-coded achievement constants (kept as requested)
  const ACHIEVEMENTS: Record<string, { text: string; color: string }> = {
    "project-cartify": { text: "Winner ($3000 credits): Raise Your Hack 2025", color: "bg-emerald-600/80" },
    "project-zesty": { text: "Honorable Mention ($5000 cash): Qloo LLM 2025", color: "bg-rose-600/80" },
    "project-zeo": { text: "3rd Prize at NovaSpark 2025", color: "bg-indigo-600/80" },
  }

  // project-specific skill tags
  const SKILLS: Record<string, string[]> = {
    "project-cartify": ["Elevenlabs", "TypeScript", "Groq", "Supabase", "React","Llama","Express"],
    "project-zesty": ["React", "TypeScript", "Tailwind","Gemini", "Qloo API", "Groq"],
    "project-zeo": ["Tavus", "Express", "Nodejs", "Typescript", "React", "WebRTC"],
  }

  const cards = projectKeys.map((id) => {
    const doc = findDoc(id)
    const title = doc?.title?.split("—")?.[0]?.trim() ?? id
    const tagline = doc?.title?.split("—")?.[1]?.trim() ?? "AI product"

    // Short, useful descriptions (kept concise and keyword-rich)
    const shortDescMap: Record<string, string> = {
      "project-cartify":
        "Voice-first assistant that recognizes, detects intent/emotion, and filters by budget, season to find real products from the database. Carts for one-click purchase, includes analytics.",
      "project-zesty":
        "Engine that uses the Qloo API to map a user’s interests, find far-away (contrastive) nodes, and surface challenging, diverse recommendations to push users out of their comfort zone.",
      "project-zeo":
        "Privacy-first mental-health AI companion with real-time conversational video avatars for mental health disorders faced by the 197 million people globally (according to WHO).",
    }

    const description = shortDescMap[id] ?? doc?.text ?? "Project details coming soon."
    const repoUrl = doc?.url ?? `https://github.com/${owner}`
    const achievements = ACHIEVEMENTS[id] ? [ACHIEVEMENTS[id]] : [{ text: "Featured in portfolio", color: "bg-emerald-600/80" }]
    const skills = SKILLS[id] ?? []

    return {
      key: id,
      title,
      tagline,
      description,
      achievements,
      skills,
      repoUrl,
      demoUrl: "#",
      siteUrl: "#",
    }
  })

  async function fetchContributions() {
    if (!process.env.GITHUB_TOKEN) return null
    try {
      const q = JSON.stringify({
        query: `query($login:String!){ user(login:$login){ contributionsCollection{ contributionCalendar{ totalContributions } } } }`,
        variables: { login: owner },
      })
      const r = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, "Content-Type": "application/json" },
        body: q,
        next: { revalidate: 900 },
      })
      if (!r.ok) return null
      const json = await r.json()
      return json?.data?.user?.contributionsCollection ?? null
    } catch {
      return null
    }
  }

  const contributions = await fetchContributions()

  return (
    <section aria-labelledby="proof-of-work">
      <h2 id="proof-of-work" className="mx-auto mb-8 max-w-screen-md text-center text-3xl font-extrabold tracking-tight">
        Proof of work
      </h2>

      <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-6 px-4 md:grid-cols-3">
        {cards.map((c) => (
          <article
            key={c.key}
            className="project-card group relative flex flex-col rounded-2xl border border-border bg-background/60 p-6 shadow-lg backdrop-blur transform transition-transform hover:-translate-y-1"
          >
            <div className="mb-4 h-40 w-full overflow-hidden rounded-lg bg-gradient-to-tr from-slate-800 to-slate-700">
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">{c.title}</div>
            </div>

            <h3 className="mb-1 text-xl font-semibold">{c.title}</h3>
            <p className="mb-3 text-sm text-muted-foreground">{c.tagline}</p>

            <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-4">{c.description}</p>

            <div className="mb-4 flex flex-wrap gap-2">
              {c.achievements.map((a, i) => (
                <div key={i} className={`rounded-full px-3 py-1 text-xs font-medium text-white ${a.color}`}>
                  {a.text}
                </div>
              ))}
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {c.skills.map((s, i) => (
                <div key={i} className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground bg-transparent">
                  {s}
                </div>
              ))}
            </div>

            <div className="mt-auto flex items-center gap-2">
              <a
                href={c.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs hover:bg-accent whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 .5C5.73.5.75 5.48.75 11.77c0 4.72 3.07 8.72 7.33 10.14.54.1.74-.24.74-.53 0-.26-.01-1-.02-1.96-2.98.65-3.61-1.44-3.61-1.44-.49-1.24-1.2-1.57-1.2-1.57-.98-.66.07-.65.07-.65 1.08.08 1.65 1.11 1.65 1.11.96 1.64 2.52 1.17 3.14.9.1-.7.37-1.17.67-1.44-2.38-.27-4.88-1.19-4.88-5.3 0-1.17.42-2.13 1.11-2.88-.11-.27-.48-1.36.11-2.84 0 0 .9-.29 2.95 1.1a10.1 10.1 0 0 1 2.68-.36c.91 0 1.82.12 2.68.36 2.05-1.39 2.95-1.1 2.95-1.1.6 1.48.23 2.57.11 2.84.69.75 1.11 1.71 1.11 2.88 0 4.12-2.5 5.02-4.88 5.29.38.33.72.98.72 1.98 0 1.43-.01 2.58-.01 2.93 0 .29.2.63.75.52C20.18 20.48 23.25 16.48 23.25 11.77 23.25 5.48 18.27.5 12 .5z" fill="currentColor" />
                </svg>
                <span className="hidden sm:inline">View code</span>
              </a>

              <a
                href={c.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs hover:bg-accent whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5v14l11-7z" fill="currentColor" />
                </svg>
                <span className="hidden sm:inline">Watch demo</span>
              </a>

              <a
                href={c.siteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs text-foreground hover:bg-accent whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M14 3h7v7h-2V6.41L10.41 15 9 13.59 18.59 4H14V3z" fill="currentColor" />
                  <path d="M5 5h5V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5h-2v5H5V5z" fill="currentColor" />
                </svg>
                <span className="truncate">View site</span>
              </a>
            </div>
          </article>
        ))}
      </div>

      <style>{`
        /* subtle animated white border on hover */
        .project-card { position: relative; overflow: hidden; }
        .project-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          border: 2px solid rgba(255,255,255,0);
          pointer-events: none;
          transform: scale(0.98);
          transition: border-color 260ms ease, transform 360ms cubic-bezier(.2,.9,.2,1), opacity 260ms ease;
          opacity: 0;
        }
        .project-card:hover::before,
        .project-card:focus-within::before,
        .project-card.group-hover::before { /* fallback */
          border-color: rgba(255,255,255,0.9);
          transform: scale(1);
          opacity: 1;
        }
      `}</style>
      
      {contributions ? (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Total contributions this year: {contributions.contributionCalendar?.totalContributions ?? "—"}
        </div>
      ) : null}
    </section>
  )
}
