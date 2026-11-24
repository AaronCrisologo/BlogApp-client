<script setup>
defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: 'Are you sure?' },
  message: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Confirm' },
  cancelLabel: { type: String, default: 'Cancel' },
  busy: { type: Boolean, default: false },
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="show" class="dialog-layer" @click.self="emit('cancel')">
        <div class="dialog" role="dialog" aria-modal="true" :aria-label="title">
          <h2 class="dialog-title">{{ title }}</h2>
          <p class="dialog-message" v-if="message">{{ message }}</p>

          <div class="dialog-actions">
            <button
              class="btn-quiet"
              type="button"
              :disabled="busy"
              @click="emit('cancel')"
            >
              {{ cancelLabel }}
            </button>
            <button
              class="btn-danger-solid"
              type="button"
              :disabled="busy"
              @click="emit('confirm')"
            >
              {{ busy ? 'Deleting…' : confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>