<template>
  <div class="admin-page">
    <header class="admin-header">
      <div class="admin-header-inner">
        <router-link to="/" class="admin-brand">安双初 · 技术笔记</router-link>
        <nav class="admin-nav">
          <router-link to="/">返回博客</router-link>
          <button class="btn-logout" @click="handleLogout">退出</button>
        </nav>
      </div>
    </header>

    <main class="admin-main">
      <div class="admin-toolbar">
        <h2>文章管理</h2>
        <router-link to="/admin/new" class="btn-primary">+ 新建文章</router-link>
      </div>

      <p v-if="error" class="error-msg">{{ error }}</p>

      <div v-if="loading" class="loading">加载中...</div>

      <div v-else-if="posts.length === 0" class="empty">
        还没有文章，点击"新建文章"开始写第一篇。
      </div>

      <table v-else class="post-table">
        <thead>
          <tr>
            <th>标题</th>
            <th>分类</th>
            <th>状态</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id">
            <td class="td-title">{{ post.title }}</td>
            <td><span class="cat-badge" :style="{ background: post.category_color + '20', color: post.category_color }">{{ post.category }}</span></td>
            <td>{{ post.published ? '已发布' : '草稿' }}</td>
            <td class="td-date">{{ formatDate(post.updated_at) }}</td>
            <td class="td-actions">
              <router-link :to="`/admin/edit/${post.id}`" class="action-link">编辑</router-link>
              <button @click="handleDelete(post.id)" class="action-delete">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../stores/auth.js'
import { api } from '../api/client.js'

const router = useRouter()
const posts = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  await authStore.fetchMe()
  if (!authStore.user) {
    router.push('/login')
    return
  }
  await loadPosts()
})

async function loadPosts() {
  try {
    loading.value = true
    posts.value = await api('/posts/admin/all')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function handleDelete(id) {
  if (!confirm('确定删除这篇文章？')) return
  try {
    await api(`/posts/${id}`, { method: 'DELETE' })
    posts.value = posts.value.filter(p => p.id !== id)
  } catch (e) {
    error.value = e.message
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/')
}

function formatDate(dateStr) {
  return dateStr ? dateStr.slice(0, 10) : '-'
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: var(--dark);
}

.admin-header {
  border-bottom: 1px solid var(--card-border);
  padding: 16px 24px;
}

.admin-header-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-brand {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
}

.admin-nav {
  display: flex;
  align-items: center;
  gap: 16px;
}

.admin-nav a {
  font-size: 0.88rem;
  color: var(--text-muted);
  text-decoration: none;
}

.admin-nav a:hover {
  color: var(--primary-light);
}

.btn-logout {
  padding: 6px 16px;
  border: 1px solid var(--card-border);
  border-radius: 6px;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.85rem;
  cursor: pointer;
  transition: var(--transition);
}

.btn-logout:hover {
  border-color: var(--accent2);
  color: var(--accent2);
}

.admin-main {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 40px 24px;
}

.admin-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.admin-toolbar h2 {
  font-size: 1.5rem;
  color: #fff;
}

.btn-primary {
  padding: 10px 24px;
  border: none;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition);
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.error-msg {
  color: var(--accent2);
  margin-bottom: 16px;
}

.loading, .empty {
  text-align: center;
  color: var(--text-muted);
  padding: 60px 0;
  font-size: 0.95rem;
}

.post-table {
  width: 100%;
  border-collapse: collapse;
}

.post-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 0.82rem;
  color: var(--text-muted);
  border-bottom: 1px solid var(--card-border);
  font-weight: 500;
}

.post-table td {
  padding: 14px 16px;
  font-size: 0.92rem;
  color: var(--text);
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.post-table tr:hover td {
  background: rgba(255,255,255,0.02);
}

.td-title {
  color: #fff;
  font-weight: 500;
}

.cat-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 12px;
}

.td-date {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.td-actions {
  display: flex;
  gap: 12px;
}

.action-link {
  font-size: 0.85rem;
  color: var(--accent);
  text-decoration: none;
}

.action-link:hover {
  color: var(--primary-light);
}

.action-delete {
  background: none;
  border: none;
  font-size: 0.85rem;
  color: var(--accent2);
  cursor: pointer;
}

.action-delete:hover {
  opacity: 0.8;
}

@media (max-width: 640px) {
  .post-table thead { display: none; }
  .post-table, .post-table tbody, .post-table tr, .post-table td { display: block; }
  .post-table tr {
    padding: 16px;
    border-bottom: 1px solid var(--card-border);
  }
  .post-table td {
    padding: 4px 0;
    border: none;
  }
  .td-title { font-size: 1rem; }
}
</style>
