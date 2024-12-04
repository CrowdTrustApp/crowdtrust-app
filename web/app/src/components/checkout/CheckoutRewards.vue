<template>
  <div class="checkout-rewards f-col">
    <div class="rewards-label">
      {{ ts('checkout.all_rewards') }}
    </div>
    <div v-if="rewards.length" class="rewards-wrap">
      <ProjectReward
        v-for="reward in rewards"
        :reward="reward"
        @addReward="addReward(reward.id)"
      />
    </div>
    <div v-else class="rewards-empty">
      {{ ts('project.no_rewards') }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IRewardViewModel } from '@app/types'
import { ts } from '../../i18n'
import ProjectReward from '../project/ProjectReward.vue'
import { store } from '@app/store'

const { projectId } = defineProps<{
  rewards: IRewardViewModel[]
  projectId: string
}>()

const itemQuantity = (rewardId: string): number | undefined => {
  const items = store.cart.projects.value[projectId]?.items
  return items?.find((item) => item.rewardId === rewardId)?.quantity
}
const addReward = (rewardId: string) => {
  const current = itemQuantity(rewardId)
  if (current !== undefined) {
    store.cart.updateQuantity(projectId, rewardId, current + 1)
  } else {
    store.cart.addItem(projectId, rewardId, 1)
  }
}
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.checkout-rewards {
  display: flex;
  align-items: flex-start;
  width: 100%;
  position: relative;
  padding-right: 48px;
  margin-top: 64px;
}
.rewards-label {
  @mixin semibold 16px;
  text-align: center;
  width: 100%;
}
.rewards-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  border-bottom: 1px solid $border1;
  border-top: 1px solid $border1;
  padding: 0 0 32px 0;
  margin-top: 8px;
  width: 100%;
}
.cart-wrap {
  position: absolute;
  right: 0;
  top: 24px;
  cursor: pointer;
  user-select: none;
}
.cart-icon {
  @mixin size 28px;
}
.cart-quantity {
  @mixin title 15px;
  text-align: center;
  color: $red;
}
.rewards-empty {
  @mixin semibold 24px;
  padding: 48px 0 40px;
  text-align: center;
  width: 100%;
  color: $text-light;
  border-top: 1px solid $border1;
  border-bottom: 1px solid $border1;
  margin-top: 8px;
}
.reward {
  width: calc(25% - 12px);
  max-width: 240px;
  min-width: 220px;
  margin-top: 24px;
  color: $text2;
  &:not(:first-child) {
    margin-left: 16px;
  }
}
</style>
