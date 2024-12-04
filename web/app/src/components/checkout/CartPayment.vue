<template>
  <div class="cart-payment">
    <div class="payment-title">
      {{ ts('checkout.payment') }}
    </div>
    <div v-if="synced" class="payment-text">
      {{ ts('checkout.payment_synced') }}
    </div>
    <div v-else class="payment-text">
      {{ ts('checkout.payment_text') }}
    </div>
    <div class="total-wrap">
      <div class="total-label">
        {{ ts('total') }}
      </div>
      <div class="total">{{ total }}<span>ETH</span></div>
    </div>
    <CTButton :text="ts('pay')" class="pay-button" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { toEthDisplay } from '@samatech/vue3-eth'
import { ts } from '../../i18n'
import { ICartReward } from './i-cart-reward'
import CTButton from '../widgets/CTButton.vue'

const { cartRewards } = defineProps<{
  cartRewards: ICartReward[]
  synced: boolean
}>()

const total = computed(() => {
  const val = cartRewards.reduce(
    (a, b) => a + BigInt(b.quantity) * BigInt(b.reward.price),
    0n,
  )
  return toEthDisplay(val)
})
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.cart-payment {
  border-left: 1px solid $border1;
  border-right: 1px solid $border1;
  border-bottom: 1px solid $border1;
  padding: 8px 12px 20px 12px;
}
.payment-title {
  @mixin semibold 16px;
}
.payment-text {
  @mixin text 15px;
  margin-top: 8px;
}
.total-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
}
.total-label {
  @mixin medium 16px;
  margin-right: 24px;
}
.total {
  @mixin semibold 20px;
  span {
    margin-left: 4px;
    @mixin medium 13px;
  }
}
.pay-button {
  margin-top: 16px;
}
</style>
