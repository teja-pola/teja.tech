import Image from "next/image"

export async function Projects() {
  const owner = "teja-pola"

  // minimal hardcoded project cards; replace text/images with exact resume content when available
  const cards = [
    {
      key: "cartify",
      title: "Cartify.ai",
      tagline: "AI shopping agent",
      description: "Checkout assistant and shopping automation built with LLMs, product search and cart intelligence.",
      achievements: [{ text: "Winner: Global AI Hackathon - $3,000 credits", color: "bg-emerald-600/80" }],
      repoUrl: "https://github.com/teja-pola/Cartify",
      demoUrl: "#",
      siteUrl: "#",
    },
    {
      key: "zesty",
      title: "Zesty",
      tagline: "Unrecommendation agent",
      description: "An agent that suggests what not to buy and improves recommendations using user feedback loops.",
      achievements: [{ text: "Featured product", color: "bg-rose-600/80" }],
      repoUrl: "https://github.com/teja-pola/Zesty",
      demoUrl: "#",
      siteUrl: "#",
    },
    {
      key: "zeo",
      title: "Zeo",
      tagline: "Personalization & AI UX",
      description: "Personalization platform using embeddings and real-time inference for better user experiences.",
      achievements: [{ text: "Top 3 in Hackathon", color: "bg-indigo-600/80" }],
      repoUrl: "https://github.com/teja-pola/Zeo",
      demoUrl: "#",
      siteUrl: "#",
    },
  ]

  // Only fetch contributions (streak/total) — keep this minimal and server-side
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
      <h2 id="proof-of-work" className="mx-auto mt-8 mb-8 max-w-screen-md text-center text-4xl font-extrabold tracking-tight">
        Proof of work
      </h2>

      <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-6 px-4 md:grid-cols-3">
        {cards.map((c) => (
          <article
            key={c.key}
            className="relative flex flex-col rounded-2xl border border-border bg-background/60 p-6 shadow-lg backdrop-blur"
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

            <div className="mt-auto flex items-center justify-between gap-3">
              <div className="flex gap-2">
                <a
                  href={c.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent"
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
                  className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                  <span className="hidden sm:inline">Watch demo</span>
                </a>
              </div>

              <a
                href={c.siteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-white hover:opacity-95"
              >
                View site
              </a>
            </div>
          </article>
        ))}
      </div>

      {contributions ? (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Total contributions this year: {contributions.contributionCalendar?.totalContributions ?? "—"}
        </div>
      ) : null}
    </section>
  )
}
