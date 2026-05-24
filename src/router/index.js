import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import AdminEditor from '../views/AdminEditor.vue'
import { authStore } from '../stores/auth.js'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/admin', name: 'admin', component: AdminDashboard, meta: { requiresAuth: true } },
  { path: '/admin/new', name: 'admin-new', component: AdminEditor, meta: { requiresAuth: true } },
  { path: '/admin/edit/:id', name: 'admin-edit', component: AdminEditor, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !authStore.user) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

export default router
