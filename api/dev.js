import app from './index.js'

const PORT = process.env.API_PORT || 3001
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`)
})
