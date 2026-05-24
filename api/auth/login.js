import bcrypt from 'bcryptjs'
import sql from '../_lib/db.js'
import { signToken } from '../_lib/auth.js'
import { parseBody } from '../_lib/parse.js'
import { setCors, handlePreflight } from '../_lib/cors.js'

export default async function handler(req, res) {
  setCors(res)
  if (handlePreflight(req, res)) return
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password } = await parseBody(req)
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
}
