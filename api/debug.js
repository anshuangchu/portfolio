import sql from './_lib/db.js'

export default async function handler(req, res) {
  try {
    // Test 1: simple query
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`

    // Test 2: count posts
    const count = await sql`SELECT COUNT(*) as cnt FROM posts`

    // Test 3: try the actual query
    const posts = await sql`SELECT id, title FROM posts LIMIT 1`

    res.json({
      tables: tables.map(t => t.table_name),
      count: count[0].cnt,
      sampleTitle: posts[0]?.title || 'none',
    })
  } catch (err) {
    res.status(500).json({
      error: err.message,
      stack: err.stack?.split('\n').slice(0, 5).join('\\n'),
    })
  }
}
