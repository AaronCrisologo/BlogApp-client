<script setup>
import { RouterLink } from 'vue-router'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer-inner">
      <RouterLink to="/about" class="site-footer-brand">Hassaku Blogs</RouterLink>
      <span>Written by the community &middot; &copy; {{ year }}</span>
    </div>
  </footer>
</template>