<template>
  <header class="hero">
    <div class="hero-bg"></div>
    <div class="hero-content">
      <div class="avatar">笔</div>
      <p class="hero-label">技术博客</p>
      <h1 class="hero-name">安双初 · 技术笔记</h1>
      <p class="hero-tagline">
        记录 <span class="highlight">AI 大模型</span>
        <span class="dot">&middot;</span>
        <span class="highlight">编程开发</span>
        <span class="dot">&middot;</span>
        <span class="highlight">嵌入式硬件</span>
      </p>
      <p class="hero-bio">
        跨领域的技术探索笔记，将知识沉淀为文字，与同路人分享。
      </p>
      <div class="hero-actions">
        <button @click="scrollTo('posts')">最新文章</button>
        <button @click="scrollTo('about')">关于</button>
      </div>
    </div>
  </header>
</template>

<script setup>
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(108, 92, 231, 0.15) 0%, transparent 60%),
    radial-gradient(ellipse at 70% 80%, rgba(0, 206, 201, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse at 50% 50%, rgba(253, 121, 168, 0.08) 0%, transparent 50%);
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  padding: 24px;
}

.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  color: #fff;
  margin: 0 auto 16px;
  box-shadow: 0 8px 32px rgba(108, 92, 231, 0.3);
}

.hero-label {
  font-size: 0.85rem;
  color: var(--primary-light);
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 12px;
  opacity: 0.7;
}

.hero-name {
  font-size: 3rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.hero-tagline {
  font-size: 1.15rem;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.highlight {
  color: var(--primary-light);
  font-weight: 500;
}

.dot {
  margin: 0 6px;
  color: var(--text-muted);
}

.hero-bio {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: 36px;
}

.hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
}

.hero-actions button {
  padding: 12px 28px;
  border: 1px solid var(--primary);
  border-radius: 30px;
  background: rgba(108, 92, 231, 0.1);
  color: var(--primary-light);
  font-size: 0.95rem;
  cursor: pointer;
  transition: var(--transition);
}

.hero-actions button:hover {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 4px 20px rgba(108, 92, 231, 0.35);
}

@media (max-width: 600px) {
  .hero-name { font-size: 2.2rem; }
  .hero-tagline { font-size: 1rem; }
  .hero-actions button { padding: 10px 20px; font-size: 0.88rem; }
}
</style>
