<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import api, { apiError } from '../api'
import { notyf } from '../main'

const router = useRouter()

const title = ref('')
const content = ref('')
const busy = ref(false)

async function createPost() {
  if (!title.value.trim() || !content.value.trim()) {
    notyf.error('Title and content are required.')
    return
  }

  busy.value = true
  try {
    const res = await api.post('/posts', {
      title: title.value.trim(),
      content: content.value.trim(),
    })
    notyf.success('Post published.')
    router.push(`/posts/${res.data.post._id}`)
  } catch (err) {
    notyf.error(apiError(err))
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="page-head">
    <h1>Write a post</h1>
    <p>Say something worth reading.</p>
  </div>

  <div class="card-blog">
    <form class="d-grid gap-3" @submit.prevent="createPost">
      <div>
        <label for="post-title" class="form-label">Title</label>
        <input id="post-title" v-model="title" type="text" class="form-control" required />
      </div>
      <div>
        <label for="post-content" class="form-label">Content</label>
        <textarea
          id="post-content"
          v-model="content"
          class="form-control"
          rows="12"
          required
        ></textarea>
      </div>
      <div class="d-flex justify-content-end gap-2">
        <RouterLink to="/posts" class="btn-quiet">Cancel</RouterLink>
        <button class="btn-solid" type="submit" :disabled="busy">Publish</button>
      </div>
    </form>
  </div>
</template>