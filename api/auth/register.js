import bcrypt from 'bcryptjs'
import sql from '../_lib/db.js'
import { signToken } from '../_lib/auth.js'
import { parseBody } from '../_lib/parse.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { username, email, password, inviteCode } = await parseBody(req)

    const expected = process.env.INVITE_CODE
    if (expected && inviteCode !== expected) {
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
}
