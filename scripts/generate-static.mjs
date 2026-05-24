import { neon } from '@neondatabase/serverless'
import fs from 'fs'
import path from 'path'

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.warn('DATABASE_URL not set, skipping static data generation')
  process.exit(0)
}

const sql = neon(DATABASE_URL)

try {
  const posts = await sql`
    SELECT id, title, excerpt, category, category_color, tags, published,
           created_at, updated_at
    FROM posts
    WHERE published = true
    ORDER BY created_at DESC
  `

  const result = posts.map(p => ({
    ...p,
    tags: Array.isArray(p.tags) ? p.tags : [],
  }))

  const dir = path.resolve('dist/data')
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'posts.json'), JSON.stringify(result), 'utf-8')
  console.log(`Generated static data: ${result.length} posts`)
} catch (err) {
  console.error('Failed to generate static data:', err.message)
  process.exit(0)
}
