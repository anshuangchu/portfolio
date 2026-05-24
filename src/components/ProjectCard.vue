<template>
  <div class="card">
    <div class="card-icon">{{ icon }}</div>
    <h3 class="card-title">{{ title }}</h3>
    <p class="card-desc">{{ description }}</p>
    <div class="card-tags">
      <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
    </div>
    <a v-if="safeLink" :href="safeLink" target="_blank" rel="noopener noreferrer" class="card-link">了解更多 &rarr;</a>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { sanitizeUrl } from '../utils/security.js'

const props = defineProps({
  icon: { type: String, default: '📁' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: Array, default: () => [] },
  link: { type: String, default: '' },
})

const safeLink = computed(() => sanitizeUrl(props.link))
</script>

<style scoped>
.card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
  padding: 32px 28px;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card:hover {
  transform: translateY(-6px);
  border-color: var(--primary);
  box-shadow: 0 12px 40px rgba(108, 92, 231, 0.15);
}

.card-icon {
  font-size: 2.4rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
}

.card-desc {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.65;
  flex: 1;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-size: 0.78rem;
  padding: 4px 12px;
  border-radius: 20px;
  background: rgba(108, 92, 231, 0.15);
  color: var(--primary-light);
}

.card-link {
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 4px;
}
</style>
