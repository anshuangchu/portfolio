import jwt from 'jsonwebtoken'
import sql from '../_lib/db.js'
import { setCors, handlePreflight } from '../_lib/cors.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'

export default async function handler(req, res) {
  setCors(res)
  if (handlePreflight(req, res)) return
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未登录' })
  }
  try {
    const token = header.slice(7)
    jwt.verify(token, JWT_SECRET)
  } catch {
    return res.status(401).json({ error: '登录已过期' })
  }

  try {
    const posts = await sql`
      SELECT id, title, excerpt, category, category_color, tags, published,
             created_at, updated_at
      FROM posts
      ORDER BY created_at DESC
    `
    res.json(posts.map(p => ({ ...p, tags: Array.isArray(p.tags) ? p.tags : [] })))
  } catch (err) {
    console.error('admin list error:', err)
    res.status(500).json({ error: '获取文章列表失败' })
  }
}
