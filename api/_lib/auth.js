import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'
const JWT_EXPIRES = '7d'

export function signToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

export function requireAuth(handler) {
  return async (req, res) => {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ error: '未登录' })
    }

    try {
      const token = header.slice(7)
      const payload = jwt.verify(token, JWT_SECRET)
      req.userId = payload.sub
      return handler(req, res)
    } catch {
      return res.status(401).json({ error: '登录已过期，请重新登录' })
    }
  }
}
