<template>
  <Modal
    cls="ct-alert-modal"
    :show="show"
    :cancelByClickingOutside="false"
    @cancel="emit('done')"
  >
    <div class="modal-title">
      {{ title }}
    </div>
    <div class="modal-text">
      {{ text || '' }}
    </div>
    <CTButton text="Ok" class="ct-alert-modal-done" @click="emit('done')" />
  </Modal>
</template>

<script lang="ts" setup>
import Modal from './Modal.vue'
import CTButton from './CTButton.vue'

defineProps<{
  show: boolean
  title: string
  text?: string
}>()

const emit = defineEmits<{
  (e: 'done'): void
}>()
</script>

<style lang="postcss">
.ct-alert-modal {
  .modal-inner {
    width: 360px;
  }
  .modal-title {
    text-align: center;
  }
  .modal-text {
    text-align: center;
  }
  .ct-alert-modal-done {
    width: 100%;
    margin-top: 32px;
  }
}
</style>
