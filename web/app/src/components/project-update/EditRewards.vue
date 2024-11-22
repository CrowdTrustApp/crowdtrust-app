<template>
  <div class="edit-rewards project-fields">
    <div class="rewards-text">
      {{ ts('edit_project.rewards') }}
    </div>
    <div class="project-rewards">
      <EditRewardCard
        v-for="(reward, index) in rewards"
        :key="reward.id"
        :reward="reward"
        :draggable="true"
        class="reward"
        :dragging="draggingIndex !== undefined"
        @dragstart="dragstart($event, index)"
        @drag="drag"
        @dragenter="dragenter($event, index)"
        @dragover="dragover($event, index)"
        @dragleave="dragleave"
        @dragend="dragend"
        @drop="drop($event, index)"
        @delete="deleteReward(reward.id)"
        @edit="editReward = reward"
      />
      <div v-if="rewards.length === 0" class="no-rewards f-center">
        {{ ts('edit_project.no_rewards') }}
      </div>
    </div>
    <CTButton
      :text="ts('edit_project.new_reward')"
      class="reward-bottom"
      @click="showNewReward = true"
    />
    <NewRewardModal
      :show="showNewReward"
      @cancel="showNewReward = false"
      @complete="reloadProject"
    />
    <EditRewardModal
      :reward="editReward"
      @cancel="editReward = undefined"
      @complete="reloadProject"
    />
  </div>
</template>

<script lang="ts" setup>
import { swappedOrder, useEditProject, useListDrag } from '@app/util-app'
import { ts } from '../../i18n'
import { computed, ref } from 'vue'
import CTButton from '../widgets/CTButton.vue'
import EditRewardCard from './EditRewardCard.vue'
import NewRewardModal from './NewRewardModal.vue'
import EditRewardModal from './EditRewardModal.vue'

const { project, deleteReward, updateRewardsOrder, loadProject } = useEditProject()

const {
  newPos,
  draggingIndex,
  dragstart,
  drag,
  dragenter,
  dragover,
  dragleave,
  drop,
  dragend,
} = useListDrag({
  dataIdentifier: 'text/style-id',
  getDragElement: (e) => e.target as HTMLElement,
  onDrop: (_e, dragIndex, targetIndex) => updateOrder(dragIndex, targetIndex),
})

const error = ref()
const editReward = ref()
const showNewReward = ref(false)

const rewards = computed(() => {
  let order = project.value?.rewards_order
  if (order) {
    if (newPos.value !== undefined && draggingIndex.value !== undefined) {
      order = swappedOrder(order, draggingIndex.value, newPos.value)
    }
    const rewards = order
      .map((id) => {
        const reward = project.value?.rewards.find((reward) => reward.id === id)
        return reward ? { ...reward, loading: false } : undefined
      })
      .filter((reward) => !!reward)
    return rewards
  }
  return project.value?.rewards ?? []
})

const reloadProject = () => {
  showNewReward.value = false
  editReward.value = undefined
  if (project.value) {
    loadProject(project.value.id)
  }
}

const updateOrder = async (from: number, to: number) => {
  let order = project.value?.rewards_order
  if (order) {
    try {
      const newOrder = swappedOrder(order, from, to)
      await updateRewardsOrder(newOrder)
    } catch (e) {
      error.value = ts('errors.Unknown')
    }
  }
}
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.edit-rewards.project-fields {
  padding: 16px 0 120px;
  width: 100%;
}
.rewards-text {
  @mixin text 15px;
}
.project-rewards {
  display: flex;
  width: 100%;
  max-width: 100%;
  height: 324px;
  border: 1px solid $border2;
  margin-top: 16px;
  padding: 8px 0 9px 8px;
  overflow-x: auto;
}
.reward-bottom {
  margin-top: 16px;
}
.no-rewards {
  @mixin semibold 20px;
  width: 100%;
  height: 100%;
  color: $text-light;
}
.reward {
  margin-right: 8px;
}
</style>
