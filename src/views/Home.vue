<template>
  <div>
    <HeroSection />
    <main>
      <BlogPosts />
      <AboutSection />
    </main>
    <FooterContact />
  </div>
</template>

<script setup>
import HeroSection from '../components/HeroSection.vue'
import BlogPosts from '../components/BlogPosts.vue'
import AboutSection from '../components/AboutSection.vue'
import FooterContact from '../components/FooterContact.vue'
</script>
