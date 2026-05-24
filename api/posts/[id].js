import jwt from 'jsonwebtoken'
import sql from '../_lib/db.js'
import { parseBody } from '../_lib/parse.js'
import { setCors, handlePreflight } from '../_lib/cors.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'

export default async function handler(req, res) {
  setCors(res)
  if (handlePreflight(req, res)) return
  const { id } = req.query

  if (req.method === 'GET') {
    return handleGet(req, res, id)
  }
  if (req.method === 'PUT') {
    return handleUpdate(req, res, id)
  }
  if (req.method === 'DELETE') {
    return handleDelete(req, res, id)
  }
  res.status(405).json({ error: 'Method not allowed' })
}

async function handleGet(req, res, id) {
  try {
    const [post] = await sql`
      SELECT p.*, u.username as author_name
      FROM posts p JOIN users u ON p.author_id = u.id
      WHERE p.id = ${id}
    `
    if (!post) return res.status(404).json({ error: '文章不存在' })
    post.tags = Array.isArray(post.tags) ? post.tags : []
    res.json(post)
  } catch (err) {
    console.error('get post error:', err)
    res.status(500).json({ error: '获取文章失败' })
  }
}

function getUserId(req) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return null
  try {
    const token = header.slice(7)
    const payload = jwt.verify(token, JWT_SECRET)
    return payload.sub
  } catch {
    return null
  }
}

async function handleUpdate(req, res, id) {
  const userId = getUserId(req)
  if (!userId) return res.status(401).json({ error: '未登录' })

  try {
    const { title, content, excerpt, category, category_color, tags, published } = await parseBody(req)
    const [post] = await sql`
      UPDATE posts SET
        title = COALESCE(${title}, title),
        content = COALESCE(${content}, content),
        excerpt = COALESCE(${excerpt}, excerpt),
        category = COALESCE(${category}, category),
        category_color = COALESCE(${category_color}, category_color),
        tags = COALESCE(${JSON.stringify(tags || null)}, tags),
        published = COALESCE(${published}, published),
        updated_at = NOW()
      WHERE id = ${id} AND author_id = ${userId}
      RETURNING id, title, updated_at
    `
    if (!post) return res.status(404).json({ error: '文章不存在或无权限修改' })
    res.json(post)
  } catch (err) {
    console.error('update post error:', err)
    res.status(500).json({ error: '更新文章失败' })
  }
}

async function handleDelete(req, res, id) {
  const userId = getUserId(req)
  if (!userId) return res.status(401).json({ error: '未登录' })

  try {
    const [post] = await sql`
      DELETE FROM posts WHERE id = ${id} AND author_id = ${userId}
      RETURNING id
    `
    if (!post) return res.status(404).json({ error: '文章不存在或无权限删除' })
    res.json({ message: '已删除' })
  } catch (err) {
    console.error('delete post error:', err)
    res.status(500).json({ error: '删除失败' })
  }
}
