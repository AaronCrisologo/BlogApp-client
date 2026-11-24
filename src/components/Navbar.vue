<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { clearSession, currentUser, token } from '../api'

const router = useRouter()
const loggedIn = computed(() => Boolean(token.value))
const isAdmin = computed(() => currentUser.value?.isAdmin === true)
const username = computed(() => currentUser.value?.username || '')

function logout() {
  clearSession()
  router.push('/login')
}
</script>

<template>
  <header class="masthead">
    <div class="masthead-inner">
      <RouterLink to="/posts" class="brand">
        八朔
        <span class="badge-admin ms-2" v-if="isAdmin">Admin</span>
      </RouterLink>

      <nav class="site-nav">
        <RouterLink to="/posts" class="nav-link-blog">Posts</RouterLink>

        <template v-if="loggedIn">
          <RouterLink to="/posts/add" class="nav-link-blog">Write</RouterLink>

          <button class="btn-quiet" type="button" @click="logout">Logout</button>
        </template>

        <template v-else>
          <RouterLink to="/login" class="nav-link-blog">Login</RouterLink>
          <RouterLink to="/register" class="btn-solid btn-sm-blog">Register</RouterLink>
        </template>
      </nav>
    </div>
  </header>
</template>