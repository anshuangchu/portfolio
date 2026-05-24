<template>
  <section id="ai" class="section">
    <h2 class="section-title">AI 与大模型项目</h2>
    <p class="section-desc">探索大模型应用、AI Agent 开发和智能编程工具的前沿实践</p>
    <div class="grid">
      <ProjectCard
        icon="🤖"
        title="MiMo 大模型集成应用"
        description="基于小米 MiMo-V2-Flash 模型（309B 参数，MoE 架构）的智能应用开发。利用 OpenAI 兼容 API 实现多模型动态切换、Agent 工作流编排，对比 Claude、DeepSeek、MiMo 在不同场景下的表现。"
        :tags="['MiMo', 'LLM', 'Agent', 'API集成']"
      />
      <ProjectCard
        icon="⚡"
        title="Claude Code 自动化工作流"
        description="深度使用 Claude Code 终端 Agent 进行全流程自动化：代码开发、原理图审查、文档生成。配置自定义 Hooks 和 MCP Server，支持多 Agent 并行协作——可委派前端/后端/QA 等子 Agent 并行处理复杂任务。"
        :tags="['Claude Code', 'MCP', 'Agent Teams', 'Hook']"
      />
      <ProjectCard
        icon="🧠"
        title="AI Agent 驱动构建系统"
        description="探索 Multi-Agent 协作模式下的智能构建流水线。基于 Anthropic Agent Teams 架构，实现从需求分析到代码生成的全自动化流程，支持原理图与 PCB 协同设计，复杂任务可 7 小时自主完成。"
        :tags="['Multi-Agent', 'CodeGen', 'EDA', '自动化']"
      />
      <ProjectCard
        icon="🔗"
        title="MCP 协议生态集成"
        description="基于 Model Context Protocol 标准化 Agent 与外部工具连接。集成 EasyEDA MCP、GitHub MCP 等，打通 PCB 设计→代码仓库→CI/CD 全链路，构建可互操作的 AI 工具生态系统。"
        :tags="['MCP协议', 'A2A', '工具集成', '标准化']"
      />
      <ProjectCard
        icon="🔄"
        title="多智能体编排实验"
        description="基于 LangGraph 和 CrewAI 构建角色化 Agent 团队——Orchestrator 负责全局任务分解与调度，子 Agent 各司其职（编码、审查、测试、文档）。探索集中式编排与去中心化协作的混合架构。"
        :tags="['LangGraph', 'CrewAI', '编排', '协作']"
      />
      <ProjectCard
        icon="📊"
        title="代码知识图谱探索"
        description="借鉴 Codebase-Memory 思路，基于 Tree-Sitter AST 解析构建代码库知识图谱，通过 MCP 协议为 LLM 提供结构化代码查询。比传统文件遍历节省约 10 倍 Token，支持调用链追踪与影响分析。"
        :tags="['AST', '知识图谱', 'MCP', 'Token优化']"
      />
    </div>
  </section>
</template>

<script setup>
import ProjectCard from './ProjectCard.vue'
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}
</style>
