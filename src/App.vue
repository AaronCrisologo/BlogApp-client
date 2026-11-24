<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import FooterBar from './components/FooterBar.vue'
</script>

<template>
  <div class="site">
    <Navbar />

    <main class="site-main">
      <RouterView />
    </main>

    <FooterBar />
  </div>
</template>