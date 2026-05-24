<template>
  <article class="post-card" :style="{ '--tag-color': categoryColor }">
    <div class="post-category" :style="{ background: categoryColor + '20', color: categoryColor }">
      {{ category }}
    </div>
    <h3 class="post-title">{{ title }}</h3>
    <p class="post-excerpt">{{ excerpt }}</p>
    <div class="post-meta">
      <span class="post-date">{{ date }}</span>
      <span class="post-read">{{ readTime }} 分钟</span>
    </div>
    <div class="post-tags">
      <span v-for="tag in tags" :key="tag" class="post-tag">{{ tag }}</span>
    </div>
  </article>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  category: { type: String, required: true },
  categoryColor: { type: String, default: '#6c5ce7' },
  date: { type: String, required: true },
  readTime: { type: Number, default: 5 },
  tags: { type: Array, default: () => [] },
})
</script>

<style scoped>
.post-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
  padding: 28px;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
}

.post-card:hover {
  transform: translateY(-4px);
  border-color: var(--tag-color, var(--primary));
  box-shadow: 0 8px 30px color-mix(in srgb, var(--tag-color, var(--primary)) 15%, transparent);
}

.post-category {
  align-self: flex-start;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 12px;
  border-radius: 20px;
  letter-spacing: 0.3px;
}

.post-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #fff;
  line-height: 1.45;
}

.post-excerpt {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.65;
  flex: 1;
}

.post-meta {
  display: flex;
  gap: 16px;
  font-size: 0.78rem;
  color: rgba(255,255,255,0.35);
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.post-tag {
  font-size: 0.72rem;
  padding: 3px 10px;
  border-radius: 12px;
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.4);
}
</style>
