;(() => {
  // Theme
  const key = "theme"
  const root = document.documentElement
  const btn = document.getElementById("themeToggle")
  function applyTheme(t) {
    root.setAttribute("data-theme", t)
  }
  const stored = localStorage.getItem(key)
  applyTheme(
    stored || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
  )
  btn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark"
    localStorage.setItem(key, next)
    applyTheme(next)
  })

  // Live viewers via SSE
  const countEl = document.getElementById("liveCount")
  try {
    const es = new EventSource("/events")
    es.addEventListener("viewers", (e) => {
      countEl.textContent = e.data
    })
    es.onerror = () => {
      // If SSE fails (e.g. preview limits), degrade gracefully
      countEl.textContent = countEl.textContent || "1"
    }
  } catch (e) {
    console.warn("[v0] SSE unsupported, fallback count used.")
  }
})()
