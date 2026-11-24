<script setup>
import { RouterLink } from 'vue-router'
import { token } from '../api'
</script>

<template>
  <div class="notice">
    <div class="notice-code">404</div>
    <h1>Page not found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <RouterLink to="/posts" class="btn-solid">Back to posts</RouterLink>
    <RouterLink v-if="!token" to="/login" class="btn-quiet ms-2">Login</RouterLink>
  </div>
</template>