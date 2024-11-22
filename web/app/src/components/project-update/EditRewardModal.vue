<template>
  <Modal
    :show="!!reward"
    :cancelByClickingOutside="false"
    cls="new-reward-modal"
    @cancel="emit('cancel')"
  >
    <div class="modal-title">
      {{ ts('reward.new') }}
    </div>
    <RewardInfo
      v-if="reward"
      :reward="reward"
      :feature="feature"
      @complete="emit('complete')"
    />
  </Modal>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useEditProject, useRewardInfo, useRewardInfoFields } from '@app/util-app'
import { IRewardViewModel } from '@app/types'
import Modal from '../widgets/Modal.vue'
import RewardInfo from './RewardInfo.vue'
import { ts } from '../../i18n'

const { reward } = defineProps<{
  reward: IRewardViewModel | undefined
}>()
const emit = defineEmits<{
  (e: 'complete'): void
  (e: 'cancel'): void
}>()

const { project } = useEditProject()

const feature = useRewardInfo()

watch(
  () => reward,
  (newReward) => {
    const newFields = useRewardInfoFields(newReward)
    feature.name = newFields.name
    feature.description = newFields.description
    feature.deliveryTime = newFields.deliveryTime
    feature.backerLimit = newFields.backerLimit
    feature.price = newFields.price
  },
)
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
