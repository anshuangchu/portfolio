import jwt from 'jsonwebtoken'
import sql from '../_lib/db.js'
import { parseBody } from '../_lib/parse.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'

export default async function handler(req, res) {
  // GET /api/posts — public: only published
  // POST /api/posts — create new post (auth required)
  if (req.method === 'GET') {
    return handleList(req, res)
  }
  if (req.method === 'POST') {
    return handleCreate(req, res)
  }
  res.status(405).json({ error: 'Method not allowed' })
}

async function handleList(req, res) {
  try {
    const posts = await sql`
      SELECT id, title, excerpt, category, category_color, tags, published,
             created_at, updated_at, author_id
      FROM posts
      WHERE published = true
      ORDER BY created_at DESC
    `
    res.json(posts.map(p => ({ ...p, tags: JSON.parse(p.tags || '[]') })))
  } catch (err) {
    console.error('list posts error:', err)
    res.status(500).json({ error: '获取文章列表失败' })
  }
}

async function handleCreate(req, res) {
  // Auth check
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未登录' })
  }
  let userId
  try {
    const token = header.slice(7)
    const payload = jwt.verify(token, JWT_SECRET)
    userId = payload.sub
  } catch {
    return res.status(401).json({ error: '登录已过期' })
  }

  try {
    const { title, content, excerpt, category, category_color, tags, published } = await parseBody(req)
    if (!title || !content || !category) {
      return res.status(400).json({ error: '标题、内容和分类不能为空' })
    }

    const [post] = await sql`
      INSERT INTO posts (title, content, excerpt, category, category_color, tags, published, author_id)
      VALUES (${title}, ${content}, ${excerpt || ''}, ${category}, ${category_color || '#6c5ce7'},
              ${JSON.stringify(tags || [])}, ${published || false}, ${userId})
      RETURNING id, title, created_at
    `
    res.status(201).json(post)
  } catch (err) {
    console.error('create post error:', err)
    res.status(500).json({ error: '创建文章失败' })
  }
}
