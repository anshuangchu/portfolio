export async function parseBody(req) {
  const raw = req.body
  if (raw) return typeof raw === 'string' ? JSON.parse(raw) : raw
  return new Promise((resolve) => {
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}) } catch { resolve({}) }
    })
  })
}
