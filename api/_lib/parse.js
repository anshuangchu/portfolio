export async function parseBody(req) {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? chunk : chunk.toString())
  }
  const raw = chunks.join('')
  return raw ? JSON.parse(raw) : {}
}
