<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-col">
        <h4>联系我</h4>
        <p>对 AI、机器人或智能车竞赛感兴趣？欢迎交流与合作。</p>
      </div>
      <div class="footer-col">
        <h4>链接</h4>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="#" @click.prevent>邮箱: 3288456983@qq.com</a>
      </div>
      <div class="footer-col">
        <h4>关于本站</h4>
        <p>使用 Vue 3 + Vite 构建 &middot; 纯手工打造</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 安双初. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 60px 24px 30px;
  margin-top: 40px;
}

.footer-content {
  max-width: var(--max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
}

.footer-col h4 {
  font-size: 1rem;
  color: #fff;
  margin-bottom: 12px;
}

.footer-col p,
.footer-col a {
  font-size: 0.9rem;
  color: var(--text-muted);
  display: block;
  margin-bottom: 8px;
}

.footer-bottom {
  max-width: var(--max-width);
  margin: 40px auto 0;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.04);
  text-align: center;
  font-size: 0.82rem;
  color: var(--text-muted);
}
</style>
