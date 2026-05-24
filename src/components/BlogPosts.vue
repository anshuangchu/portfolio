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

    <div class="grid">
      <PostCard
        v-for="post in filteredPosts"
        :key="post.title"
        v-bind="post"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import PostCard from './PostCard.vue'

const activeTab = ref('all')

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'ai', label: 'AI / 大模型' },
  { key: 'dev', label: '编程开发' },
  { key: 'embedded', label: '嵌入式 / 硬件' },
]

const posts = [
  // --- AI / 大模型 ---
  {
    title: '从 Prompt 到 Agent：LLM 应用的范式转变',
    excerpt: '2024 年我们还在调 Prompt，2025 年 Agent 框架百花齐放，2026 年多智能体协作成为标配。这篇文章梳理 LLM 应用从对话到自主 Agent 的演进脉络，以及背后的关键技术和工程挑战。',
    category: 'AI / 大模型',
    categoryColor: '#6c5ce7',
    date: '2026-05-20',
    readTime: 8,
    tags: ['LLM', 'Agent', '范式转变'],
  },
  {
    title: 'MCP 协议深度解析：让 AI 工具互联互通',
    excerpt: 'Model Context Protocol 正在成为 AI Agent 生态的基石协议。本文从协议设计、传输层、工具定义到 MCP Server 开发，完整解析 MCP 的工作原理与最佳实践。',
    category: 'AI / 大模型',
    categoryColor: '#6c5ce7',
    date: '2026-05-15',
    readTime: 12,
    tags: ['MCP', '协议', '工具集成'],
  },
  {
    title: 'Multi-Agent 编排实战：LangGraph vs CrewAI',
    excerpt: '两种主流多智能体框架的深度对比。从架构设计、任务编排、人机协作到生产部署，结合真实项目经验分析各自的优劣势与适用场景。',
    category: 'AI / 大模型',
    categoryColor: '#6c5ce7',
    date: '2026-05-08',
    readTime: 10,
    tags: ['Multi-Agent', 'LangGraph', 'CrewAI'],
  },
  {
    title: 'AI 编程工具进化论：从代码补全到自主开发',
    excerpt: 'GitHub Copilot 开启 AI 编程时代，Claude Code 将终端 Agent 带入主流，Code Scalpel 用 AST 实现零幻觉编程。展望 AI 辅助开发的下一阶段。',
    category: 'AI / 大模型',
    categoryColor: '#6c5ce7',
    date: '2026-04-28',
    readTime: 7,
    tags: ['AI编程', 'Claude Code', 'AST'],
  },

  // --- 编程开发 ---
  {
    title: 'Vue 3 组合式 API：优雅的状态管理之道',
    excerpt: '从 Options API 到 Composition API 的思维转变。深入探讨 provide/inject、响应式工具函数、组合函数设计模式，以及如何在大型项目中组织状态逻辑。',
    category: '编程开发',
    categoryColor: '#00cec9',
    date: '2026-05-12',
    readTime: 6,
    tags: ['Vue 3', 'Composition API', '状态管理'],
  },
  {
    title: 'Vite 插件开发实战：从零构建安全头插件',
    excerpt: 'Vite 插件系统是前端构建工具能力的核心。本文通过开发一个 HTTP 安全头注入插件，讲解 Vite 插件钩子、中间件集成、配置解析等关键技术点。',
    category: '编程开发',
    categoryColor: '#00cec9',
    date: '2026-04-22',
    readTime: 8,
    tags: ['Vite', '插件开发', '安全'],
  },
  {
    title: '前端安全防护：Content-Security-Policy 配置指南',
    excerpt: 'CSP 是抵御 XSS 攻击的最后一道防线。从指令详解、策略生成、常见陷阱到 report-uri 监控，手把手配置一个生产级 CSP 策略。',
    category: '编程开发',
    categoryColor: '#00cec9',
    date: '2026-04-15',
    readTime: 5,
    tags: ['CSP', '安全', 'XSS'],
  },

  // --- 嵌入式 / 硬件 ---
  {
    title: 'FOC 无刷电机控制：原理、实现与调参',
    excerpt: '磁场定向控制（FOC）是现代机器人驱动的核心技术。从 Clark/Park 变换到 SVPWM 调制，从电流环到速度环，完整解析 FOC 的数学原理与工程实现。',
    category: '嵌入式 / 硬件',
    categoryColor: '#fd79a8',
    date: '2026-05-05',
    readTime: 15,
    tags: ['FOC', '无刷电机', '控制算法'],
  },
  {
    title: '串级 PID 平衡控制：从理论到调参',
    excerpt: '轮腿机器人的平衡控制是典型的串级 PID 应用。详解外环角度环与内环角速度环的设计思路、四元数姿态解算、以及"重心控速"的独创调参方法。',
    category: '嵌入式 / 硬件',
    categoryColor: '#fd79a8',
    date: '2026-04-18',
    readTime: 10,
    tags: ['串级PID', '平衡控制', '四元数'],
  },
  {
    title: '智能车电源树设计：从电池到各模块供电',
    excerpt: '可靠的电源系统是智能车稳定运行的基石。从电池选型、DC-DC 降压、LDO 稳压到电源树拓扑设计，分享竞赛级智能车电源系统的设计经验。',
    category: '嵌入式 / 硬件',
    categoryColor: '#fd79a8',
    date: '2026-04-10',
    readTime: 7,
    tags: ['电源设计', 'PCB', '智能车'],
  },
]

const filteredPosts = computed(() =>
  activeTab.value === 'all'
    ? posts
    : posts.filter(p => {
        if (activeTab.value === 'ai') return p.category === 'AI / 大模型'
        if (activeTab.value === 'dev') return p.category === '编程开发'
        if (activeTab.value === 'embedded') return p.category === '嵌入式 / 硬件'
        return true
      })
)
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

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}
</style>
