<template>
  <section class="section">
    <h2 class="section-title">行业趋势与洞察</h2>
    <p class="section-desc">追踪 AI、机器人与开发者工具领域的前沿动态</p>
    <div class="insights">
      <article v-for="item in insights" :key="item.title" class="insight-card">
        <div class="insight-header">
          <span class="insight-icon">{{ item.icon }}</span>
          <div>
            <h3 class="insight-title">{{ item.title }}</h3>
            <span class="insight-source">{{ item.source }}</span>
          </div>
        </div>
        <p class="insight-body">{{ item.body }}</p>
        <a v-if="item.link" :href="item.link" target="_blank" rel="noopener noreferrer" class="insight-link">查看原文 &rarr;</a>
      </article>
    </div>
  </section>
</template>

<script setup>
const insights = [
  {
    icon: '🔀',
    title: '2026：多智能体协作的"微服务时刻"',
    source: 'Gartner / Anthropic 2026 趋势报告',
    body: '从单一全能型 Agent 向多智能体编排系统转变。Gartner 报告显示多智能体咨询量暴增 1,445%，Anthropic 发现多 Agent 在困难任务上比单 Agent 高出 90.2%。56% 企业认为多智能体更易扩展。竞争焦点从"谁的模型最聪明"转向"谁能用最可靠的工程体系封装智能"。',
    link: '',
  },
  {
    icon: '📡',
    title: 'MCP + A2A：Agent 互联网的"HTTP 时刻"',
    source: 'Anthropic / Google 2025-2026',
    body: 'MCP（Model Context Protocol）定义 Agent 与工具的连接标准，A2A（Agent-to-Agent Protocol）定义跨厂商 Agent 通信标准。二者正成为 Agent 生态的基础协议，构建可互操作的 Agent 市场和 Agent Internet。几乎全部新开源 AI 项目已原生支持 MCP。',
    link: '',
  },
  {
    icon: '🏆',
    title: '第21届智能车竞赛：轮腿穿越组全面解析',
    source: '全国大学生智能汽车竞赛组委会 2026',
    body: '2026 赛季轮腿组迎来重大变革：场地从室内转向室外操场，新增三级台阶、颠簸路段、草地、雷区探测等科目。仅限定舵机/电机型号，车体结构完全自设计。磁编码器、IMU 模块须自行焊接，GPS+惯导融合成为导航核心方案。',
    link: '',
  },
  {
    icon: '💡',
    title: 'AI 编程从"文本生成"迈向"结构化操作"',
    source: 'Code Scalpel / Codebase-Memory 2026',
    body: '新一代 AI 编程工具不再依赖纯文本猜测，而是基于 AST 抽象语法树和 PDG 程序依赖图进行确定性代码操作。Codebase-Memory 比传统文件探索节省 10 倍 Token，Code Scalpel 通过 AST 验证编辑实现零幻觉编程。',
    link: '',
  },
  {
    icon: '🌐',
    title: '全球 AI Agent 市场：2030 年达 520 亿美元',
    source: 'Gartner / Market Reports 2026',
    body: 'AI Agent 市场预计从 2025 年的 78 亿美元增长至 2030 年 520 亿美元（CAGR > 45%）。Gartner 预测到 2026 年底 40% 企业应用将集成任务型 AI Agent，79% 企业已部署 AI Agent，23% 处于规模化生产阶段。',
    link: '',
  },
  {
    icon: '🛡️',
    title: 'Agent 治理与安全成为核心竞争壁垒',
    source: 'IBM / Anthropic 2026 安全报告',
    body: '随着 Agent 自主性增强，治理缺口成为最大风险——行为可观测性、运行时策略执行、溯源追踪仍不完善。间接提示注入、视觉欺骗、多 Agent 协调冲突等新攻击面涌现。"受限自治"架构和 FinOps 成本治理正在成为企业级 Agent 部署的标配。',
    link: '',
  },
]
</script>

<style scoped>
.insights {
  max-width: 850px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.insight-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
  padding: 24px 28px;
  transition: var(--transition);
}

.insight-card:hover {
  border-color: var(--primary);
  box-shadow: 0 6px 24px rgba(108, 92, 231, 0.1);
}

.insight-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 12px;
}

.insight-icon {
  font-size: 1.6rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.insight-title {
  font-size: 1.08rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
}

.insight-source {
  font-size: 0.78rem;
  color: var(--primary-light);
}

.insight-body {
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.75;
}

.insight-link {
  display: inline-block;
  margin-top: 10px;
  font-size: 0.85rem;
  font-weight: 500;
}
</style>
