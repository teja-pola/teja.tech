let viewers = 0

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const encoder = new TextEncoder()

  viewers += 1

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = () => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ count: viewers })}\n\n`))
      }

      // Send immediately so the client shows a value quickly
      send()

      // Keep connection alive and periodically refresh count
      const heartbeat = setInterval(send, 15_000)

      const onAbort = () => {
        clearInterval(heartbeat)
        viewers = Math.max(0, viewers - 1)
        try {
          controller.close()
        } catch {}
      }

      // Close cleanly when client disconnects
      ;(controller as ReadableStreamDefaultController<Uint8Array> & { signal?: AbortSignal }).signal?.addEventListener(
        "abort",
        onAbort,
        { once: true }
      )
    },
    cancel() {
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
