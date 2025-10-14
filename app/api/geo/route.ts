export async function GET(req: Request) {
  const h = req.headers
  // Try common edge/CDN headers provided by Vercel/Cloudflare and others
  const headerCountry =
    h.get("x-vercel-ip-country") || h.get("cf-ipcountry") || h.get("x-country-code") || h.get("x-geo-country")

  // Fallback: try to infer from Accept-Language (e.g., en-US)
  let fallback = ""
  const al = h.get("accept-language") || ""
  const m = al.match(/-([A-Z]{2})(?:,|;|$)/)
  if (m && m[1]) fallback = m[1]

  const country = (headerCountry || fallback || "UN").toUpperCase()
  return Response.json({ country })
}
