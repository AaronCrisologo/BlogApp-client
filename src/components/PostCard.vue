<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import api, { apiError, canManage, currentUser, formatDate, isOwner } from '../api'
import { notyf } from '../main'
import ConfirmDialog from './ConfirmDialog.vue'

const props = defineProps({
  post: { type: Object, required: true },
})

const emit = defineEmits(['deleted'])

const busy = ref(false)
const confirming = ref(false)

// Authors manage their own posts; admins can manage any post.
const manage = computed(() => canManage(props.post))
const admin = computed(() => currentUser.value?.isAdmin === true)
const own = computed(() => isOwner(props.post))

async function remove() {
  confirming.value = false
  busy.value = true
  try {
    // Admins deleting someone else's post go through the admin endpoint.
    const url = admin.value && !own.value
      ? `/posts/admin/${props.post._id}`
      : `/posts/${props.post._id}`

    await api.delete(url)
    notyf.success('Post deleted.')
    emit('deleted')
  } catch (err) {
    notyf.error(apiError(err))
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <article class="post">
    <h2 class="post-title">
      <RouterLink :to="`/posts/${post._id}`">{{ post.title }}</RouterLink>
    </h2>

    <p class="post-meta">
      <span class="meta-author" v-if="post.author">{{ post.author.username }}</span>
      <span class="meta-dot" v-if="post.author && post.createdOn">&middot;</span>
      <span v-if="post.createdOn">{{ formatDate(post.createdOn) }}</span>
    </p>

    <p class="post-excerpt">{{ post.content }}</p>

    <div class="post-foot">
      <RouterLink :to="`/posts/${post._id}`" class="read-more">Read more</RouterLink>

      <div class="post-actions" v-if="manage">
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