<template>
  <Modal cls="confirm-modal" @cancel="emit('cancel')">
    <div v-if="title" class="modal-title">
      {{ title }}
    </div>
    <div class="modal-text">
      <slot name="text" />
      {{ text ?? '' }}
    </div>
    <div class="modal-buttons">
      <CTButton
        class="confirm-button button2"
        :text="ts('confirm')"
        :animate="loading"
        @click="emit('confirm')"
      />
      <CTButton
        class="cancel-button"
        :text="computedCancelText"
        :secondary="true"
        @click="emit('cancel')"
      />
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import Modal from './Modal.vue'
import { computed, toRefs } from 'vue'
import { ts } from '../../i18n'
import CTButton from './CTButton.vue'

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const props = withDefaults(
  defineProps<{
    title?: string
    text?: string
    loading?: boolean
    cancelText?: string
  }>(),
  {
    title: undefined,
    text: undefined,
    cancelText: undefined,
  },
)

const { cancelText } = toRefs(props)

// Use `computed` for default because `t` is not available in `defineProps`.
const computedCancelText = computed(() => cancelText.value ?? ts('cancel'))
</script>

<style lang="postcss" scoped>
.modal-buttons {
  display: flex;
  margin-top: 24px;
}
:slotted(.confirm-button) {
  margin-right: 8px;
  min-width: 94px;
}
:slotted(.cancel-button) {
  margin-left: 8px;
}
.cancel-button {
  margin-left: 8px;
}
</style>
