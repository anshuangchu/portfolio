import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import sql from './_lib/db.js'
import { signToken, requireAuth } from './_lib/auth.js'

const app = express()

app.use(cors())
app.use(express.json())

// ─── Auth ───

app.post('/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
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

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: '请填写邮箱和密码' })
    }

    const [user] = await sql`SELECT * FROM users WHERE email = ${email}`
    if (!user) {
      return res.status(401).json({ error: '邮箱或密码错误' })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: '邮箱或密码错误' })
    }

    const token = signToken(user.id)
    res.json({ user: { id: user.id, username: user.username, email: user.email, created_at: user.created_at }, token })
  } catch (err) {
    console.error('login error:', err)
    res.status(500).json({ error: '登录失败' })
  }
})

app.get('/auth/me', requireAuth, async (req, res) => {
  try {
    const [user] = await sql`SELECT id, username, email, created_at FROM users WHERE id = ${req.userId}`
    if (!user) return res.status(404).json({ error: '用户不存在' })
    res.json(user)
  } catch (err) {
    console.error('me error:', err)
    res.status(500).json({ error: '获取用户信息失败' })
  }
})

// ─── Posts ───

app.get('/posts', async (req, res) => {
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
})

app.get('/posts/:id', async (req, res) => {
  try {
    const [post] = await sql`
      SELECT p.*, u.username as author_name
      FROM posts p JOIN users u ON p.author_id = u.id
      WHERE p.id = ${req.params.id}
    `
    if (!post) return res.status(404).json({ error: '文章不存在' })
    post.tags = JSON.parse(post.tags || '[]')
    res.json(post)
  } catch (err) {
    console.error('get post error:', err)
    res.status(500).json({ error: '获取文章失败' })
  }
})

app.get('/posts/admin/all', requireAuth, async (req, res) => {
  try {
    const posts = await sql`
      SELECT id, title, excerpt, category, category_color, tags, published,
             created_at, updated_at
      FROM posts
      ORDER BY created_at DESC
    `
    res.json(posts.map(p => ({ ...p, tags: JSON.parse(p.tags || '[]') })))
  } catch (err) {
    console.error('admin list error:', err)
    res.status(500).json({ error: '获取文章列表失败' })
  }
})

app.post('/posts', requireAuth, async (req, res) => {
  try {
    const { title, content, excerpt, category, category_color, tags, published } = req.body
    if (!title || !content || !category) {
      return res.status(400).json({ error: '标题、内容和分类不能为空' })
    }

    const [post] = await sql`
      INSERT INTO posts (title, content, excerpt, category, category_color, tags, published, author_id)
      VALUES (${title}, ${content}, ${excerpt || ''}, ${category}, ${category_color || '#6c5ce7'},
              ${JSON.stringify(tags || [])}, ${published || false}, ${req.userId})
      RETURNING id, title, created_at
    `
    res.status(201).json(post)
  } catch (err) {
    console.error('create post error:', err)
    res.status(500).json({ error: '创建文章失败' })
  }
})

app.put('/posts/:id', requireAuth, async (req, res) => {
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
      WHERE id = ${req.params.id} AND author_id = ${req.userId}
      RETURNING id, title, updated_at
    `
    if (!post) return res.status(404).json({ error: '文章不存在或无权限修改' })
    res.json(post)
  } catch (err) {
    console.error('update post error:', err)
    res.status(500).json({ error: '更新文章失败' })
  }
})

app.delete('/posts/:id', requireAuth, async (req, res) => {
  try {
    const [post] = await sql`
      DELETE FROM posts WHERE id = ${req.params.id} AND author_id = ${req.userId}
      RETURNING id
    `
    if (!post) return res.status(404).json({ error: '文章不存在或无权限删除' })
    res.json({ message: '已删除' })
  } catch (err) {
    console.error('delete post error:', err)
    res.status(500).json({ error: '删除失败' })
  }
})

export default app
