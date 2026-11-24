<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import api, { apiError } from '../api'
import { notyf } from '../main'

const router = useRouter()

const email = ref('')
const username = ref('')
const password = ref('')
const busy = ref(false)

async function register() {
  busy.value = true
  try {
    await api.post('/users/register', {
      email: email.value.trim(),
      username: username.value.trim(),
      password: password.value,
    })
    notyf.success('Registered! You can log in now.')
    router.push('/login')
  } catch (err) {
    notyf.error(apiError(err))
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="page-head">
    <h1>Register</h1>
    <p>Create an account to start posting.</p>
  </div>

  <div class="auth-form">
    <form class="d-grid gap-3" @submit.prevent="register">
      <div>
        <label for="reg-email" class="form-label">Email</label>
        <input
          id="reg-email"
          v-model="email"
          type="email"
          class="form-control"
          required
          autocomplete="email"
        />
      </div>
      <div>
        <label for="reg-username" class="form-label">Username</label>
        <input
          id="reg-username"
          v-model="username"
          type="text"
          class="form-control"
          minlength="3"
          required
          autocomplete="username"
        />
        <div class="form-text">At least 3 characters.</div>
      </div>
      <div>
        <label for="reg-password" class="form-label">Password</label>
        <input
          id="reg-password"
          v-model="password"
          type="password"
          class="form-control"
          minlength="8"
          required
          autocomplete="new-password"
        />
        <div class="form-text">At least 8 characters.</div>
      </div>
      <button class="btn-solid" type="submit" :disabled="busy">Register</button>
    </form>

    <p class="auth-alt">
      Already have an account? <RouterLink to="/login">Log in</RouterLink>.
    </p>
  </div>
</template>