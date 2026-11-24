<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import api, { apiError, canManage, currentUser, isOwner } from '../api'
import { notyf } from '../main'

const route = useRoute()
const router = useRouter()

const post = ref(null)
const title = ref('')
const content = ref('')
const loading = ref(true)
const busy = ref(false)
const forbidden = ref(false)

const admin = computed(() => currentUser.value?.isAdmin === true)
const own = computed(() => isOwner(post.value))

async function loadPost() {
  loading.value = true
  try {
    const res = await api.get(`/posts/${route.params.id}`)
    post.value = res.data.post

    // Only the author (or an admin) may edit.
    if (!canManage(post.value)) {
      forbidden.value = true
      return
    }

    title.value = post.value.title
    content.value = post.value.content
  } catch (err) {
    if (err?.response?.status !== 404) notyf.error(apiError(err))
    forbidden.value = true
  } finally {
    loading.value = false
  }
}

async function savePost() {
  if (!title.value.trim() || !content.value.trim()) {
    notyf.error('Title and content are required.')
    return
  }

  busy.value = true
  try {
    // Admins editing someone else's post go through the admin endpoint.
    const url = admin.value && !own.value
      ? `/posts/admin/${post.value._id}`
      : `/posts/${post.value._id}`

    await api.patch(url, {
      title: title.value.trim(),
      content: content.value.trim(),
    })

    notyf.success('Post updated.')
    router.push(`/posts/${post.value._id}`)
  } catch (err) {
    notyf.error(apiError(err))
  } finally {
    busy.value = false
  }
}

onMounted(() => {
  loadPost()
})
</script>

<template>
  <p class="empty-note" v-if="loading">Loading...</p>

  <div v-else-if="forbidden" class="notice">
    <div class="notice-code">403</div>
    <h1>Not allowed</h1>
    <p>You can only edit your own posts.</p>
    <RouterLink to="/posts" class="btn-solid">Back to posts</RouterLink>
  </div>

  <template v-else>
    <div class="page-head">
      <h1>Edit post</h1>
      <p v-if="admin && !own">Editing another author's post as admin.</p>
      <p v-else>Update your post.</p>
    </div>

    <div class="card-blog">
      <form class="d-grid gap-3" @submit.prevent="savePost">
        <div>
          <label for="edit-title" class="form-label">Title</label>
          <input id="edit-title" v-model="title" type="text" class="form-control" required />
        </div>
        <div>
          <label for="edit-content" class="form-label">Content</label>
          <textarea
            id="edit-content"
            v-model="content"
            class="form-control"
            rows="12"
            required
          ></textarea>
        </div>
        <div class="d-flex justify-content-end gap-2">
          <RouterLink :to="`/posts/${post._id}`" class="btn-quiet">Cancel</RouterLink>
          <button class="btn-solid" type="submit" :disabled="busy">Save changes</button>
        </div>
      </form>
    </div>
  </template>
</template>