<template>
  <div class="cart-reward">
    <img :src="urlFromAsset(reward.image)" class="item-image" />
    <div class="name">
      {{ reward.name }}
    </div>
    <div class="price">
      {{ price(reward.price) }}
    </div>
    <div class="delivery">
      <div class="delivery-text">
        {{ ts('project.delivery') }}
      </div>
      <div class="time">
        {{ delivery(reward.delivery_time) }}
      </div>
    </div>
    <div class="quantity-wrap">
      <div class="minus" @click="emit('increment')">
        <Plus class="quantity-icon" />
      </div>
      <div class="quantity">
        {{ quantity }}
      </div>
      <div class="minus" @click="emit('decrement')">
        <Minus class="quantity-icon" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { format } from 'date-fns'
import { toEthDisplay } from '@samatech/vue3-eth'
import { IRewardViewModel } from '@app/types'
import { urlFromAsset } from '@app/util'
import { ts } from '../../i18n'
import Minus from '../svg/Minus.vue'
import Plus from '../svg/Plus.vue'

defineProps<{
  reward: IRewardViewModel
  quantity: number
}>()
const emit = defineEmits<{
  (e: 'increment'): void
  (e: 'decrement'): void
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

.cart-reward {
  display: flex;
  height: 88px;
  padding: 8px 0;
  align-items: center;
  border-bottom: 1px solid $border1;
}

.item-image {
  width: 64px;
  height: 64px;
  background-color: #bec2c4;
  object-fit: cover;
}
.name {
  @mixin title 15px;
  margin-left: 10px;
  min-width: 200px;
}
.price {
  @mixin medium 15px;
  margin-left: 24px;
}
.delivery {
  margin-left: 16px;
}
.delivery-text {
  @mixin semibold 12px;
  color: $text-light2;
  margin-top: 4px;
}
.time {
  @mixin text 14px;
  margin-left:;
}
.quantity-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.quantity-wrap {
  @mixin title 16px;
  margin-left: 8px;
}
.minus {
  margin-top: 3px;
}
</style>
