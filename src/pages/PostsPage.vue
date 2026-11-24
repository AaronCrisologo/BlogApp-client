<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import api, { apiError, currentUser } from '../api'
import { notyf } from '../main'
import PostCard from '../components/PostCard.vue'

const posts = ref([])
const loading = ref(true)
const search = ref('')

const loggedIn = computed(() => Boolean(currentUser.value))

// Filter on title, content or the author's username.
const visible = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return posts.value

  return posts.value.filter((post) => {
    const title = (post.title || '').toLowerCase()
    const content = (post.content || '').toLowerCase()
    const author = (post.author?.username || '').toLowerCase()
    return title.includes(term) || content.includes(term) || author.includes(term)
  })
})

async function loadPosts() {
  loading.value = true
  try {
    const res = await api.get('/posts')
    posts.value = res.data.posts || []
  } catch (err) {
    notyf.error(apiError(err))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPosts()
})
</script>

<template>
  <p class="guest-banner" v-if="!loggedIn">
    Want to write? <RouterLink to="/login">Log in</RouterLink> or
    <RouterLink to="/register">create an account</RouterLink>.
  </p>

  <div class="page-head">
    <div class="d-flex flex-wrap justify-content-between align-items-end gap-3">
      <div>
        <h1>Posts</h1>
        <p>The latest from every author.</p>
      </div>
      <RouterLink v-if="loggedIn" to="/posts/add" class="btn-solid btn-sm-blog">
        Write a post
      </RouterLink>
    </div>
  </div>

  <div class="filter-bar">
    <input
      v-model="search"
      class="form-control"
      placeholder="Search posts by title, content or author"
      aria-label="Search posts"
    />
  </div>

  <p class="empty-note" v-if="loading">Loading...</p>

  <template v-if="!loading">
    <p class="empty-note" v-if="posts.length === 0">
      No posts yet.
      <RouterLink v-if="loggedIn" to="/posts/add">Write the first one.</RouterLink>
    </p>
    <p class="empty-note" v-else-if="visible.length === 0">No posts match that search.</p>

    <div v-else class="post-list">
      <PostCard
        v-for="post in visible"
        :key="post._id"
        :post="post"
        @deleted="loadPosts"
      />
    </div>
  </template>
</template>