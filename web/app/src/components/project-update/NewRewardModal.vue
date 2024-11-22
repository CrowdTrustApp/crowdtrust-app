<template>
  <Modal
    v-if="project"
    :show="show"
    :cancelByClickingOutside="false"
    cls="new-reward-modal"
    @cancel="emit('cancel')"
  >
    <div class="modal-title">
      {{ ts('reward.new') }}
    </div>
    <RewardInfo :feature="feature" @complete="emit('complete')" />
  </Modal>
</template>

<script setup lang="ts">
import { useEditProject, useRewardInfo } from '@app/util-app'
import Modal from '../widgets/Modal.vue'
import RewardInfo from './RewardInfo.vue'
import { ts } from '../../i18n'

defineProps<{
  show: boolean
}>()
const emit = defineEmits<{
  (e: 'complete'): void
  (e: 'cancel'): void
}>()

const { project } = useEditProject()

const feature = useRewardInfo()
</script>

<style lang="postcss">
@import '../../css/defines.postcss';

.new-reward-modal {
  .modal-inner {
    width: 100%;
    max-width: 600px;
    max-height: 95%;
    overflow-y: auto;
  }
}
</style>
