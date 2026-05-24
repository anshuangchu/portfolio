import express from 'express'
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const app = express()
app.use(express.json())

// Load env
const DATABASE_URL = process.env.DATABASE_URL
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'
const INVITE_CODE = process.env.INVITE_CODE || 'blog2026'

const sql = neon(DATABASE_URL)

function signToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' })
}

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()
  next()
})

// Auth middleware
function getUserId(req) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return null
  try {
    return jwt.verify(header.slice(7), JWT_SECRET).sub
  } catch { return null }
}

// ==== API Routes ====

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, inviteCode } = req.body
    if (INVITE_CODE && inviteCode !== INVITE_CODE) {
      return res.status(403).json({ error: '邀请码错误' })
    }
    if (!username || !email || !password) {
      return res.status(400).json({ error: '请填写所有字段' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: '密码至少 6 位' })
    }
    const existing = await sql`SELECT id FROM users WHERE email = ${email} OR username = ${username}`
    if (existing.length > 0) {
      return res.status(409).json({ error: '用户名或邮箱已被注册' })
    }
    const hash = await bcrypt.hash(password, 10)
    const [user] = await sql`
      INSERT INTO users (username, email, password_hash)
      VALUES (${username}, ${email}, ${hash})
      RETURNING id, username, email, created_at
    `
    const token = signToken(user.id)
    res.status(201).json({ user, token })
  } catch (err) {
    console.error('register error:', err)
    res.status(500).json({ error: '注册失败，请稍后重试' })
  }
})

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: '请填写邮箱和密码' })
    }
    const [user] = await sql`SELECT * FROM users WHERE email = ${email}`
    if (!user) return res.status(401).json({ error: '邮箱或密码错误' })
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return res.status(401).json({ error: '邮箱或密码错误' })
    const token = signToken(user.id)
    res.json({ user: { id: user.id, username: user.username, email: user.email, created_at: user.created_at }, token })
  } catch (err) {
    console.error('login error:', err)
    res.status(500).json({ error: '登录失败' })
  }
})

// GET /api/auth/me
app.get('/api/auth/me', async (req, res) => {
  try {
    const userId = getUserId(req)
    if (!userId) return res.status(401).json({ error: '未登录' })
    const [user] = await sql`SELECT id, username, email, created_at FROM users WHERE id = ${userId}`
    if (!user) return res.status(404).json({ error: '用户不存在' })
    res.json(user)
  } catch {
    res.status(401).json({ error: '登录已过期，请重新登录' })
  }
})

// GET /api/posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await sql`
      SELECT id, title, excerpt, category, category_color, tags, published,
             created_at, updated_at
      FROM posts WHERE published = true ORDER BY created_at DESC
    `
    res.json(posts.map(p => ({ ...p, tags: Array.isArray(p.tags) ? p.tags : [] })))
  } catch (err) {
    console.error('list posts error:', err)
    res.status(500).json({ error: '获取文章列表失败' })
  }
})

// POST /api/posts
app.post('/api/posts', async (req, res) => {
  const userId = getUserId(req)
  if (!userId) return res.status(401).json({ error: '未登录' })
  try {
    const { title, content, excerpt, category, category_color, tags, published } = req.body
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
})

// GET /api/posts/:id
app.get('/api/posts/:id', async (req, res) => {
  try {
    const [post] = await sql`
      SELECT p.*, u.username as author_name FROM posts p JOIN users u ON p.author_id = u.id
      WHERE p.id = ${req.params.id}
    `
    if (!post) return res.status(404).json({ error: '文章不存在' })
    post.tags = Array.isArray(post.tags) ? post.tags : []
    res.json(post)
  } catch (err) {
    console.error('get post error:', err)
    res.status(500).json({ error: '获取文章失败' })
  }
})

// PUT /api/posts/:id
app.put('/api/posts/:id', async (req, res) => {
  const userId = getUserId(req)
  if (!userId) return res.status(401).json({ error: '未登录' })
  try {
    const { title, content, excerpt, category, category_color, tags, published } = req.body
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
      WHERE id = ${req.params.id} AND author_id = ${userId}
      RETURNING id, title, updated_at
    `
    if (!post) return res.status(404).json({ error: '文章不存在或无权限修改' })
    res.json(post)
  } catch (err) {
    console.error('update post error:', err)
    res.status(500).json({ error: '更新文章失败' })
  }
})

// DELETE /api/posts/:id
app.delete('/api/posts/:id', async (req, res) => {
  const userId = getUserId(req)
  if (!userId) return res.status(401).json({ error: '未登录' })
  try {
    const [post] = await sql`
      DELETE FROM posts WHERE id = ${req.params.id} AND author_id = ${userId} RETURNING id
    `
    if (!post) return res.status(404).json({ error: '文章不存在或无权限删除' })
    res.json({ message: '已删除' })
  } catch (err) {
    console.error('delete post error:', err)
    res.status(500).json({ error: '删除失败' })
  }
})

// GET /api/admin/posts
app.get('/api/admin/posts', async (req, res) => {
  const userId = getUserId(req)
  if (!userId) return res.status(401).json({ error: '未登录' })
  try {
    const posts = await sql`
      SELECT id, title, excerpt, category, category_color, tags, published,
             created_at, updated_at FROM posts ORDER BY created_at DESC
    `
    res.json(posts.map(p => ({ ...p, tags: Array.isArray(p.tags) ? p.tags : [] })))
  } catch (err) {
    console.error('admin list error:', err)
    res.status(500).json({ error: '获取文章列表失败' })
  }
})

const PORT = process.env.API_PORT || 3001
app.listen(PORT, () => {
  console.log(`Local API server running at http://localhost:${PORT}`)
})
