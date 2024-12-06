<template>
  <div class="reward f-col">
    <img :src="urlFromAsset(reward.image)" class="reward-image" />
    <div class="reward-content f-col">
      <div class="reward-text">
        <div class="reward-top">
          <div class="name">
            {{ reward.name }}
          </div>
          <div class="price">
            {{ price(reward.price) }}
          </div>
        </div>
        <div class="description">
          {{ reward.description }}
        </div>
      </div>
      <div class="delivery">
        <div class="delivery-text">
          {{ ts('project.delivery') }}
        </div>
        <div class="time">
          {{ delivery(reward.delivery_time) }}
        </div>
      </div>
    </div>
    <div class="reward-back overlay">
      <CTButton :text="ts('project.add_reward')" @click="emit('addReward')" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { format } from 'date-fns'
import { toEthDisplay } from '@samatech/vue3-eth'
import { IRewardViewModel } from '@app/types'
import { urlFromAsset } from '@app/util'
import { ts } from '../../i18n'
import CTButton from '../widgets/CTButton.vue'

defineProps<{
  reward: IRewardViewModel
}>()
const emit = defineEmits<{
  (e: 'addReward'): void
}>()

const price = (wei: string): string => {
  return `${toEthDisplay(wei)} ETH`
}

const delivery = (time: number): string => {
  return format(new Date(time * 1000), 'LLL yyyy')
}
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.reward-back {
  opacity: 0;
  transition: opacity 0.2s ease;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.15), rgba(200, 200, 200, 0.05));
  cursor: pointer;
  text-align: center;
  padding-top: 48px;
}
.reward {
  width: calc(25% - 12px);
  max-width: 240px;
  min-width: 220px;
  margin-top: 24px;
  color: $text2;
  position: relative;
  &:not(:first-child) {
    margin-left: 16px;
  }
  &:hover {
    .reward-back {
      opacity: 1;
    }
  }
}
.reward-image {
  width: 100%;
  height: 140px;
  background-color: #bec2c4;
  object-fit: cover;
}
.reward-content {
  padding: 6px 8px;
  text-align: left;
  flex-grow: 1;
}
.reward-top {
  @mixin bold 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.price {
  margin-left: 8px;
  font-size: 14px;
}
.reward-text {
  min-height: 80px;
  flex-grow: 1;
}
.description {
  @mixin text 14px;
  line-height: 120%;
  margin-top: 4px;
}
.delivery-text {
  @mixin semibold 12px;
  color: $text-light2;
  margin-top: 4px;
}
.time {
  @mixin medium 14px;
  margin-top: 2px;
}
</style>
