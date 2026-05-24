<template>
  <div>
    <nav class="top-nav">
      <router-link to="/" class="nav-brand">安双初·技术笔记</router-link>
      <div class="nav-right">
        <template v-if="authStore.isLoggedIn">
          <router-link to="/admin" class="nav-link">管理</router-link>
          <span class="nav-user">{{ authStore.user?.username }}</span>
          <button class="nav-btn" @click="handleLogout">退出</button>
        </template>
        <router-link v-else to="/login" class="nav-btn">登录</router-link>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { authStore } from './stores/auth.js'
import { useRouter } from 'vue-router'

const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>

<style>
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 52px;
  background: rgba(15, 15, 25, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(108, 92, 231, 0.15);
}

.nav-brand {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  text-decoration: none;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-link {
  color: var(--primary-light);
  text-decoration: none;
  font-size: 0.9rem;
}

.nav-link:hover {
  text-decoration: underline;
}

.nav-user {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.nav-btn {
  padding: 6px 18px;
  border-radius: 20px;
  border: 1px solid var(--primary);
  background: rgba(108, 92, 231, 0.1);
  color: var(--primary-light);
  font-size: 0.85rem;
  cursor: pointer;
  text-decoration: none;
  transition: var(--transition);
}

.nav-btn:hover {
  background: var(--primary);
  color: #fff;
}
</style>
