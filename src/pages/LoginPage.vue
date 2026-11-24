<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import api, { apiError, setSession } from '../api'
import { notyf } from '../main'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const busy = ref(false)

async function login() {
  busy.value = true
  try {
    const res = await api.post('/users/login', {
      email: email.value.trim(),
      password: password.value,
    })
    setSession(res.data.access, res.data.user)

    // Honour ?redirect= when a guard sent the user here.
    const redirect = route.query.redirect
    const target = typeof redirect === 'string' && redirect ? redirect : '/posts'

    notyf.success('Logged in.')
    router.push(target)
  } catch (err) {
    notyf.error(apiError(err))
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="page-head">
    <h1>Login</h1>
    <p>Log in to write and manage posts.</p>
  </div>

  <div class="auth-form">
    <form class="d-grid gap-3" @submit.prevent="login">
      <div>
        <label for="log-email" class="form-label">Email</label>
        <input
          id="log-email"
          v-model="email"
          type="email"
          class="form-control"
          required
          autocomplete="email"
        />
      </div>
      <div>
        <label for="log-password" class="form-label">Password</label>
        <input
          id="log-password"
          v-model="password"
          type="password"
          class="form-control"
          required
          autocomplete="current-password"
        />
      </div>
      <button class="btn-solid" type="submit" :disabled="busy">Login</button>
    </form>

    <p class="auth-alt">
      No account yet? <RouterLink to="/register">Register</RouterLink>.
    </p>
  </div>
</template>