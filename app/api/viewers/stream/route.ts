const enc = new TextEncoder()

// module-level store for a single server instance
const clients = new Set<WritableStreamDefaultWriter<Uint8Array>>()

function broadcast() {
  const payload = enc.encode(`data: ${JSON.stringify({ count: clients.size })}\n\n`)
  for (const w of clients) {
    try {
      w.write(payload)
    } catch {
      // drop dead writers
      clients.delete(w)
    }
  }
}

export async function GET(req: Request) {
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()

  // Add client and notify all
  clients.add(writer)
  // send immediate hello
  writer.write(enc.encode(`data: ${JSON.stringify({ count: clients.size })}\n\n`))
  broadcast()

  const close = () => {
    try {
      clients.delete(writer)
      broadcast()
      writer.close()
    } catch {}
  }

  // close when client disconnects
  req.signal.addEventListener("abort", close)

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}
