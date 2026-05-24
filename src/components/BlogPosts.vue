<template>
  <section id="posts" class="section">
    <h2 class="section-title">最新文章</h2>
    <p class="section-desc">AI 大模型 · 编程开发 · 嵌入式硬件 — 记录跨领域的技术探索</p>

    <div class="filter-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['filter-tab', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <p v-if="error" class="load-error">{{ error }}</p>
    <p v-if="loading" class="load-status">加载中...</p>

    <div v-else class="grid">
      <PostCard
        v-for="post in filteredPosts"
        :key="post.id"
        :title="post.title"
        :excerpt="post.excerpt || post.title"
        :category="post.category"
        :categoryColor="post.category_color"
        :date="formatDate(post.created_at)"
        :readTime="post.read_time || 5"
        :tags="post.tags || []"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PostCard from './PostCard.vue'
import { api } from '../api/client.js'

const activeTab = ref('all')
const posts = ref([])
const loading = ref(true)
const error = ref('')

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'ai', label: 'AI / 大模型' },
  { key: 'dev', label: '编程开发' },
  { key: 'embedded', label: '嵌入式 / 硬件' },
]

onMounted(async () => {
  try {
    posts.value = await api('/posts')
  } catch (e) {
    error.value = '加载文章失败：' + e.message
  } finally {
    loading.value = false
  }
})

const filteredPosts = computed(() =>
  activeTab.value === 'all'
    ? posts.value
    : posts.value.filter(p => {
        if (activeTab.value === 'ai') return p.category === 'AI / 大模型'
        if (activeTab.value === 'dev') return p.category === '编程开发'
        if (activeTab.value === 'embedded') return p.category === '嵌入式 / 硬件'
        return true
      })
)

function formatDate(dateStr) {
  if (!dateStr) return ''
  return dateStr.slice(0, 10)
}
</script>

<style scoped>
.filter-tabs {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 40px;
}

.filter-tab {
  padding: 8px 20px;
  border: 1px solid var(--card-border);
  border-radius: 24px;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition);
}

.filter-tab:hover {
  border-color: var(--primary);
  color: var(--primary-light);
}

.filter-tab.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.load-error, .load-status {
  text-align: center;
  color: var(--text-muted);
  padding: 40px 0;
}

.load-error {
  color: var(--accent2);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}
</style>
