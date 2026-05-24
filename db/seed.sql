-- 建表
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category VARCHAR(50) NOT NULL,
  category_color VARCHAR(7) DEFAULT '#6c5ce7',
  tags JSONB DEFAULT '[]',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  author_id INTEGER REFERENCES users(id) NOT NULL
);

-- 种子数据（需要先创建管理员用户，再运行以下 INSERT）
-- INSERT INTO posts (title, content, excerpt, category, category_color, tags, published, author_id) VALUES
-- ('从 Prompt 到 Agent：LLM 应用的范式转变', '<p>2024 年我们还在调 Prompt...</p>', '2024 年我们还在调 Prompt，2025 年 Agent 框架百花齐放...', 'AI / 大模型', '#6c5ce7', '["LLM","Agent","范式转变"]', true, 1);
