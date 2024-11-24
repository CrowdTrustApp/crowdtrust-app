<template>
  <div class="project-rewards">
    <div v-if="rewards.length" class="rewards-wrap">
      <div v-for="reward in rewards" class="reward">
        <img :src="urlFromAsset(reward.image)" class="reward-image" />
        <div class="reward-content">
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
      </div>
    </div>
    <div v-else class="rewards-empty">
      {{ ts('project.no_rewards') }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IRewardViewModel } from '@app/types'
import { toEthDisplay } from '@samatech/vue3-eth'
import { ts } from '../../i18n'
import { format } from 'date-fns'
import { urlFromAsset } from '@app/util'

defineProps<{
  rewards: IRewardViewModel[]
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

.project-rewards {
  display: flex;
  align-items: flex-start;
}
.rewards-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  border-bottom: 1px solid $border1;
  padding: 0 0 32px;
}
.rewards-empty {
  @mixin semibold 24px;
  padding: 48px 0 40px;
  text-align: center;
  color: $text-light;
  border-bottom: 1px solid $border1;
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
.reward-image {
  width: 100%;
  height: 140px;
  background-color: #bec2c4;
  object-fit: cover;
}
.reward-content {
  padding: 6px 8px;
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
  height: 80px;
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
