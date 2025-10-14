import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { knowledge } from "@/lib/personal-knowledge"

const WINDOW_MS = 15_000
const LIMIT = 3
const requests = new Map<string, number[]>()

function rateLimit(ip: string) {
  const now = Date.now()
  const arr = (requests.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  if (arr.length >= LIMIT) return false
  arr.push(now)
  requests.set(ip, arr)
  return true
}

// Simple keyword scoring retrieval
function retrieve(query: string, k = 4) {
  const q = query.toLowerCase()
  const scored = knowledge.map((doc, i) => {
    const text = doc.text.toLowerCase()
    let score = 0
    for (const token of q.split(/\W+/).filter(Boolean)) {
      const count = text.split(token).length - 1
      score += count
    }
    return { i, score }
  })
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((s) => knowledge[s.i])
}

export async function POST(req: NextRequest) {
  const { question } = await req.json()
  const ip = req.headers.get("x-forwarded-for") || "anon"
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Please wait a few seconds." }, { status: 429 })
  }
  if (!question || typeof question !== "string") {
    return NextResponse.json({ error: "Invalid question" }, { status: 400 })
  }

  const topDocs = retrieve(question, 5)
  const context = topDocs.map((d) => `- ${d.title}: ${d.text}`).join("\n")

  const system = `You are a helpful assistant that ONLY answers questions about Dharma Teja Pola using the provided context.
If a question is outside the context, say you don't know. Be concise and professional. Include references with [source:<id>] when relevant.`

  const prompt = `${system}
Context:
${context}

Question: ${question}
Answer:`

  const { text } = await generateText({
    model: "openai/gpt-5-mini",
    prompt,
  })

  return NextResponse.json({
    answer: `${text}\n\nSources: ${topDocs.map((d) => `[${d.id}]`).join(" ")}`,
  })
}
