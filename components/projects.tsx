export async function Projects() {
  const owner = "teja-pola"

  // Featured display names + keywords + fallback URLs (used if repo not found)
  const featured = [
    { displayName: "Cartify", keywords: ["cartify"], fallbackUrl: "https://github.com/teja-pola/Cartify" },
    { displayName: "Zesty", keywords: ["zesty"], fallbackUrl: "https://github.com/teja-pola/Zesty" },
    { displayName: "Zeo", keywords: ["zeo"], fallbackUrl: "https://github.com/teja-pola/Zeo" },
  ]

  async function fetchUserRepos() {
    const headers: Record<string, string> = { "User-Agent": "v0-portfolio" }
    // Optional: respects env var if present to increase rate limits. Safe on server only.
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

    try {
      const res = await fetch(`https://api.github.com/users/${owner}/repos?per_page=100`, {
        headers,
        next: { revalidate: 900 },
      })
      if (!res.ok) {
        // If GitHub fails, return empty to trigger graceful UI fallback
        return [] as any[]
      }
      return (await res.json()) as any[]
    } catch {
      return [] as any[]
    }
  }

  const repos = await fetchUserRepos()

  function findRepoByKeywords(keywords: string[]) {
    const needles = keywords.map((k) => k.toLowerCase())
    return (
      repos.find((r) => typeof r?.name === "string" && needles.includes(r.name.toLowerCase())) ||
      repos.find((r) => typeof r?.name === "string" && needles.some((k) => r.name.toLowerCase().includes(k))) ||
      null
    )
  }

  const data = featured.map((f) => ({ ...f, repo: findRepoByKeywords(f.keywords) }))

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {data.map(({ displayName, repo, fallbackUrl }) =>
        repo ? (
          <a
            key={repo.full_name}
            href={repo.homepage || repo.html_url || fallbackUrl}
            className="group rounded-lg border p-4 transition-colors hover:bg-accent"
            target="_blank"
            rel="noreferrer"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-semibold">{repo.name || displayName}</h3>
              <span className="text-xs text-muted-foreground">★ {repo.stargazers_count ?? 0}</span>
            </div>
            <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">
              {repo.description || "Project details coming soon."}
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              {repo.language ? <span>{repo.language}</span> : null}
            </div>
          </a>
        ) : (
          <a
            key={displayName}
            href={fallbackUrl}
            className="rounded-lg border p-4 transition-colors hover:bg-accent"
            target="_blank"
            rel="noreferrer"
          >
            <h3 className="text-sm font-semibold">{displayName}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Couldn&apos;t resolve the repo automatically. Opening the fallback link.
            </p>
          </a>
        ),
      )}
    </div>
  )
}
