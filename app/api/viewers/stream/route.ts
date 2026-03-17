let viewers = 0

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const encoder = new TextEncoder()

  viewers += 1

  let heartbeat: ReturnType<typeof setInterval> | null = null
  let closed = false

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = () => {
        if (closed) return
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ count: viewers })}\n\n`))
        } catch {
          cleanup()
        }
      }

      const cleanup = () => {
        if (closed) return
        closed = true
        if (heartbeat) clearInterval(heartbeat)
        viewers = Math.max(0, viewers - 1)
        try { controller.close() } catch {}
      }

      // Send immediately so the client shows a value quickly
      send()

      // Keep connection alive and periodically refresh count
      heartbeat = setInterval(send, 15_000)
    },
    cancel() {
      if (closed) return
      closed = true
      if (heartbeat) clearInterval(heartbeat)
      viewers = Math.max(0, viewers - 1)
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}
