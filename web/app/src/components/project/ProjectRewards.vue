<template>
  <div class="project-rewards">
    <router-link :to="{ name: 'Checkout', params: { id: projectId } }" class="cart-wrap">
      <div v-if="cartCount" class="cart-quantity" :class="{ matches: cartMatchesPledge }">
        {{ cartCount }}
      </div>
      <Cart class="cart-icon" />
    </router-link>
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
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@app/store'
import { IGetPledgeViewModel, IRewardViewModel } from '@app/types'
import { ts } from '../../i18n'
import Cart from '../svg/Cart.vue'
import ProjectReward from './ProjectReward.vue'
import { compareCartPledge } from '@app/features'

const router = useRouter()

const { pledge, projectId } = defineProps<{
  rewards: IRewardViewModel[]
  pledge: IGetPledgeViewModel | undefined
  projectId: string
}>()

const cartCount = computed(() => {
  return store.cart.projects.value[projectId]?.items?.length ?? 0
})

const cartMatchesPledge = computed(() => {
  return compareCartPledge(projectId, pledge)
})

const addReward = (rewardId: string) => {
  store.cart.addItem(projectId, rewardId, 1)
  router.push({ name: 'Checkout', params: { id: projectId } })
}
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.project-rewards {
  display: flex;
  align-items: flex-start;
  width: 100%;
  position: relative;
  padding-right: 48px;
  border-bottom: 1px solid $border1;
}
.rewards-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  border-bottom: 1px solid $border1;
  padding: 0 0 32px 0;
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
  &.matches {
    color: $primary;
  }
}
.rewards-empty {
  @mixin semibold 24px;
  padding: 48px 0 40px;
  text-align: center;
  width: 100%;
  color: $text-light;
}
</style>
