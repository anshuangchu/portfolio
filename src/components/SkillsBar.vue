<template>
  <section class="section">
    <h2 class="section-title">技术栈</h2>
    <p class="section-desc">多领域交叉的技术积累</p>
    <div class="skills">
      <div v-for="skill in skills" :key="skill.name" class="skill-item">
        <div class="skill-header">
          <span class="skill-name">{{ skill.name }}</span>
          <span class="skill-level">{{ skill.level }}%</span>
        </div>
        <div class="skill-bar">
          <div class="skill-fill" :style="{ width: skill.level + '%', background: skill.color }"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const skills = [
  { name: 'Python / AI 开发', level: 88, color: 'linear-gradient(135deg, #6c5ce7, #a29bfe)' },
  { name: 'LLM / Agent 应用', level: 85, color: 'linear-gradient(135deg, #00cec9, #81ecec)' },
  { name: '嵌入式 / 机器人控制', level: 78, color: 'linear-gradient(135deg, #fd79a8, #fab1a0)' },
  { name: 'Vue / 前端开发', level: 75, color: 'linear-gradient(135deg, #6c5ce7, #fd79a8)' },
  { name: 'PCB 设计与 EDA', level: 80, color: 'linear-gradient(135deg, #00cec9, #6c5ce7)' },
  { name: '传感器融合 / SLAM', level: 70, color: 'linear-gradient(135deg, #fd79a8, #e17055)' },
]
</script>

<style scoped>
.skills {
  max-width: 650px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.skill-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: #fff;
}

.skill-level {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.skill-bar {
  height: 8px;
  border-radius: 4px;
  background: rgba(255,255,255,0.06);
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fillBar 1.2s ease-out forwards;
}

@keyframes fillBar {
  from { width: 0 !important; }
}
</style>
