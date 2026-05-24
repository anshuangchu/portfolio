import jwt from 'jsonwebtoken'
import sql from '../_lib/db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未登录' })
  }

  try {
    const token = header.slice(7)
    const payload = jwt.verify(token, JWT_SECRET)
    const [user] = await sql`SELECT id, username, email, created_at FROM users WHERE id = ${payload.sub}`
    if (!user) return res.status(404).json({ error: '用户不存在' })
    res.json(user)
  } catch {
    res.status(401).json({ error: '登录已过期，请重新登录' })
  }
}
