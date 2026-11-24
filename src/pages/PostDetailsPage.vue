<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import api, { apiError, canManage, currentUser, formatDate, isOwner } from '../api'
import { notyf } from '../main'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const route = useRoute()
const router = useRouter()

const post = ref(null)
const loading = ref(true)
const notFound = ref(false)
const busy = ref(false)
const confirming = ref(false)

const manage = computed(() => canManage(post.value))
const admin = computed(() => currentUser.value?.isAdmin === true)
const own = computed(() => isOwner(post.value))

async function loadPost() {
  loading.value = true
  try {
    const res = await api.get(`/posts/${route.params.id}`)
    post.value = res.data.post
  } catch (err) {
    if (err?.response?.status === 404) {
      notFound.value = true
    } else {
      notyf.error(apiError(err))
    }
  } finally {
    loading.value = false
  }
}

async function remove() {
  confirming.value = false
  busy.value = true
  try {
    // Admins deleting someone else's post go through the admin endpoint.
    const url = admin.value && !own.value
      ? `/posts/admin/${post.value._id}`
      : `/posts/${post.value._id}`

    await api.delete(url)
    notyf.success('Post deleted.')
    router.push('/posts')
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

  <div v-else-if="notFound" class="notice">
    <div class="notice-code">404</div>
    <h1>Post not found</h1>
    <p>This post may have been deleted.</p>
    <RouterLink to="/posts" class="btn-solid">Back to posts</RouterLink>
  </div>

  <article v-else-if="post">
    <RouterLink to="/posts" class="back-link">&larr; All posts</RouterLink>

    <div class="article-head">
      <h1>{{ post.title }}</h1>
      <p class="byline">
        <span class="meta-author" v-if="post.author">By {{ post.author.username }}</span>
        <span class="meta-dot" v-if="post.createdOn">&middot;</span>
        <span v-if="post.createdOn">{{ formatDate(post.createdOn) }}</span>
      </p>

      <div class="post-actions mt-3" v-if="manage">
        <RouterLink :to="`/posts/${post._id}/edit`" class="btn-quiet">Edit</RouterLink>
        <button
          class="btn-danger-quiet"
          type="button"
          :disabled="busy"
          @click="confirming = true"
        >
          Delete
        </button>
      </div>
    </div>

    <div class="article-body">
      <p class="post-content">{{ post.content }}</p>
    </div>

    <ConfirmDialog
      :show="confirming"
      :title="`Delete this post?`"
      :message="`“${post.title}” will be permanently removed.`"
      confirm-label="Delete"
      :busy="busy"
      @confirm="remove"
      @cancel="confirming = false"
    />
  </article>
</template>