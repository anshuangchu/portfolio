<template>
  <div>
    <HeroSection />
    <main>
      <AiProjects />
      <RoboticsProjects />
      <ToolsProjects />
      <SkillsBar />
      <KnowledgePanel />
    </main>
    <FooterContact />
  </div>
</template>

<script setup>
import HeroSection from './components/HeroSection.vue'
import AiProjects from './components/AiProjects.vue'
import RoboticsProjects from './components/RoboticsProjects.vue'
import ToolsProjects from './components/ToolsProjects.vue'
import SkillsBar from './components/SkillsBar.vue'
import KnowledgePanel from './components/KnowledgePanel.vue'
import FooterContact from './components/FooterContact.vue'
</script>
