<template>
  <section id="about" class="section">
    <h2 class="section-title">关于</h2>
    <div class="about-content">
      <div class="about-card">
        <div class="about-avatar">安</div>
        <h3 class="about-name">安双初</h3>
        <p class="about-bio">
          从嵌入式硬件到 AI 大模型，从机器人控制到 Web 开发——热衷于在技术与技术的交汇处寻找灵感。
          这个博客记录了我跨领域探索中的思考、实践与沉淀。
        </p>
      </div>
      <div class="about-details">
        <div class="detail-item">
          <span class="detail-icon">&#x1F4DD;</span>
          <div>
            <span class="detail-label">专注方向</span>
            <span class="detail-value">AI Agent、大模型应用、机器人控制、全栈开发</span>
          </div>
        </div>
        <div class="detail-item">
          <span class="detail-icon">&#x1F4AC;</span>
          <div>
            <span class="detail-label">技术社区</span>
            <span class="detail-value"><a href="https://github.com/anshuangchu" target="_blank" rel="noopener noreferrer">GitHub</a> · 3288456983@qq.com</span>
          </div>
        </div>
        <div class="detail-item">
          <span class="detail-icon">&#x1F4F0;</span>
          <div>
            <span class="detail-label">更新频率</span>
            <span class="detail-value">不定期更新，力求每篇都有深度</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-content {
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.about-card {
  text-align: center;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
  padding: 48px 32px;
}

.about-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  margin: 0 auto 16px;
}

.about-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
}

.about-bio {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.8;
  max-width: 480px;
  margin: 0 auto;
}

.about-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-sm);
  padding: 18px 24px;
}

.detail-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.detail-label {
  display: block;
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-bottom: 2px;
}

.detail-value {
  display: block;
  font-size: 0.92rem;
  color: #fff;
}
</style>
