<template>
  <div class="cart-wrap">
    <div v-if="cartRewards.length" class="cart">
      <div class="cart-content">
        <CartItem
          v-for="cartReward in cartRewards"
          :reward="cartReward.reward"
          :quantity="cartReward.quantity"
          @increment="increaseQuantity(cartReward.reward.id)"
          @decrement="decreaseQuantity(cartReward.reward.id)"
        />
      </div>
      <CartPayment :cartRewards="cartRewards" :synced="cartMatchesPledge" @pay="pay" />
    </div>
    <div v-else class="cart-empty f-center-col">
      <div class="empty-text">
        {{ ts('checkout.no') }}
      </div>
      <router-link :to="{ name: 'Project', params: { id: project.id } }">
        <CTButton :text="ts('go_back')" class="back-button" />
      </router-link>
    </div>
    <AlertModal
      :show="showPayModal"
      title="Back Project"
      text="Backing is currently disabled. Please check back in a few days."
      @done="showPayModal = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { IProjectViewModel } from '@app/types'
import { compareCartPledge, IGetPledgeParams } from '@app/features'
import { store } from '@app/store'
import CartItem from './CartItem.vue'
import { ts } from '../../i18n'
import CTButton from '../widgets/CTButton.vue'
import { ICartReward } from './i-cart-reward'
import CartPayment from './CartPayment.vue'
import AlertModal from '../widgets/AlertModal.vue'

const { project, pledgeState } = defineProps<{
  project: IProjectViewModel
  pledgeState: IGetPledgeParams
}>()

const showPayModal = ref(false)

const cartRewards = computed(() => {
  const rewards: ICartReward[] = []
  for (const cartItem of store.cart.projects.value[project.id]?.items ?? []) {
    const reward = project.rewards.find((r) => r.id === cartItem.rewardId)
    if (reward) {
      rewards.push({ reward, quantity: cartItem.quantity })
    }
  }
  return rewards
})

const cartMatchesPledge = computed(() => {
  return compareCartPledge(project.id, pledgeState.pledge)
})

const itemQuantity = (rewardId: string): number | undefined => {
  const items = store.cart.projects.value[project.id]?.items
  return items?.find((item) => item.rewardId === rewardId)?.quantity
}

const increaseQuantity = (rewardId: string) => {
  const current = itemQuantity(rewardId) ?? 0
  store.cart.updateQuantity(project.id, rewardId, current + 1)
}

const decreaseQuantity = (rewardId: string) => {
  const current = itemQuantity(rewardId) ?? 0
  if (current > 1) {
    store.cart.updateQuantity(project.id, rewardId, current - 1)
  } else {
    store.cart.removeItem(project.id, rewardId)
  }
}

const pay = () => {
  showPayModal.value = true
}
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.cart-wrap {
  padding-right: 40px;
}
.cart {
  display: flex;
}
.cart-content {
  width: 70%;
  padding-right: 8px;
}
:deep(.cart-payment) {
  width: 30%;
}
.cart-empty {
  padding: 24px 0 16px;
}
.empty-text {
  @mixin medium 17px;
}
.back-button {
  margin-top: 16px;
}
@media (max-width: 720px) {
  .cart-wrap {
    padding-right: 0;
  }
  .cart {
    flex-direction: column;
    align-items: center;
  }
  .cart-content {
    width: 100%;
    max-width: 440px;
    padding: 0;
  }
  :deep(.cart-payment) {
    width: 100%;
    max-width: 360px;
  }
}
</style>
