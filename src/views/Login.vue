<template>
  <div class="login-page">
    <div class="login-bg"></div>
    <div class="login-card">
      <div class="login-header">
        <router-link to="/" class="login-logo">安双初 · 技术笔记</router-link>
        <h2>{{ isRegister ? '注册账号' : '登录' }}</h2>
        <p class="login-sub">{{ isRegister ? '创建账号，管理博客文章' : '登录后管理博客文章' }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div v-if="isRegister" class="field">
          <label>用户名</label>
          <input v-model="username" type="text" placeholder="你的用户名" required />
        </div>
        <div v-if="isRegister" class="field">
          <label>邀请码</label>
          <input v-model="inviteCode" type="text" placeholder="输入邀请码" required />
        </div>
        <div class="field">
          <label>邮箱</label>
          <input v-model="email" type="email" placeholder="your@email.com" required />
        </div>
        <div class="field">
          <label>密码</label>
          <input v-model="password" type="password" placeholder="至少 6 位" required />
        </div>

        <p v-if="error" class="login-error">{{ error }}</p>

        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? '处理中...' : (isRegister ? '注册' : '登录') }}
        </button>
      </form>

      <p class="login-switch">
        {{ isRegister ? '已有账号？' : '没有账号？' }}
        <button class="link-btn" @click="isRegister = !isRegister; error = ''">
          {{ isRegister ? '去登录' : '去注册' }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authStore } from '../stores/auth.js'

const router = useRouter()
const route = useRoute()

const isRegister = ref(false)
const username = ref('')
const email = ref('')
const password = ref('')
const inviteCode = ref('')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    if (isRegister.value) {
      await authStore.register(username.value, email.value, password.value, inviteCode.value)
    } else {
      await authStore.login(email.value, password.value)
    }
    const redirect = route.query.redirect || '/admin'
    router.push(redirect)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 24px;
}

.login-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(108, 92, 231, 0.15) 0%, transparent 60%),
    radial-gradient(ellipse at 70% 80%, rgba(0, 206, 201, 0.12) 0%, transparent 60%);
  z-index: 0;
}

.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
  padding: 40px 36px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-logo {
  display: inline-block;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 20px;
  text-decoration: none;
}

.login-header h2 {
  font-size: 1.6rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
}

.login-sub {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.field input {
  padding: 12px 16px;
  border: 1px solid var(--card-border);
  border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.04);
  color: #fff;
  font-size: 0.95rem;
  outline: none;
  transition: var(--transition);
}

.field input:focus {
  border-color: var(--primary);
}

.login-error {
  color: var(--accent2);
  font-size: 0.85rem;
  text-align: center;
}

.login-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.login-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.login-switch {
  text-align: center;
  margin-top: 24px;
  font-size: 0.88rem;
  color: var(--text-muted);
}

.link-btn {
  background: none;
  border: none;
  color: var(--primary-light);
  cursor: pointer;
  font-size: 0.88rem;
  text-decoration: underline;
}
</style>
