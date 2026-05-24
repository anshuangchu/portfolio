<template>
  <section id="tools" class="section">
    <h2 class="section-title">实用工具集</h2>
    <p class="section-desc">日常开发中沉淀的实用小工具，解决真实问题，提升工作效率</p>
    <div class="grid">
      <ProjectCard
        icon="🔧"
        title="EasyEDA 智能助手"
        description="通过 MCP 协议桥接嘉立创 EDA 专业版，实现原理图自动审查、器件智能选型、自动布局辅助。支持一键导出 BOM、网表，大幅提升 PCB 设计效率与准确性。"
        :tags="['MCP', 'EDA', '自动化', 'PCB设计']"
      />
      <ProjectCard
        icon="📊"
        title="多模型对比平台"
        description="统一接入 Claude、DeepSeek、MiMo 等主流大模型，提供编程、推理、创意写作等场景下的一键对比测评工具。支持自定义 Prompt、温度参数，生成可视化对比报告。"
        :tags="['模型评测', 'LLM', 'Benchmark', '前端']"
      />
      <ProjectCard
        icon="📝"
        title="竞赛文档知识库"
        description="智能车竞赛规则解读、硬件选型建议和技术文档的聚合搜索平台。支持 RAG 增强检索、AI 智能问答与自动摘要，帮助快速定位竞赛规范与最佳实践。"
        :tags="['知识库', 'RAG', '搜索', '文档']"
      />
      <ProjectCard
        icon="🧰"
        title="IT-Tools 风格工具箱"
        description="参考开源项目 IT-Tools 的 200+ 实用小工具理念，构建本地化的开发者工具集。涵盖编码转换、格式化、时序计算、网络调试等高频场景，纯本地运行保障数据隐私。"
        :tags="['开源', '工具箱', '隐私', '本地运行']"
      />
      <ProjectCard
        icon="🔬"
        title="Code Scalpel 精准代码分析"
        description="基于 AST+PDG 的代码结构分析工具，通过 MCP 协议为 AI Agent 提供确定性代码操作能力。支持代码提取、污点安全分析、符号执行验证，消除 AI 编程中的幻觉风险。"
        :tags="['AST解析', '安全分析', 'MCP', '代码重构']"
      />
      <ProjectCard
        icon="🤖"
        title="Dify AI 工作流平台实践"
        description="基于开源的 Dify 平台构建生产级 AI 工作流。编排 LLM + 知识库 + 工具调用，实现从用户输入到智能响应的完整链路。支持可视化拖拽配置，降低 AI 应用开发门槛。"
        :tags="['Dify', '工作流', '低代码', 'RAG']"
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
