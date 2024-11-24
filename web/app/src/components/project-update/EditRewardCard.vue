<template>
  <div class="edit-reward-card">
    <div class="image-wrap">
      <img :src="assetUrl" />
      <div class="image-overlay overlay f-center">
        <div class="button1 edit-button" @click="emit('edit')">
          {{ ts('edit') }}
        </div>
      </div>
    </div>
    <div class="reward-content">
      <h3 class="reward-name">
        {{ reward.name }}
      </h3>
      <div class="reward-description">
        {{ reward.description }}
      </div>
      <div class="info-wrap">
        <div class="info-col">
          <div class="info-label">
            {{ ts('reward.backers') }}
          </div>
          <div class="info-val">
            {{ backers }}
          </div>
        </div>
        <div class="info-col">
          <div class="info-label">
            {{ ts('reward.ships') }}
          </div>
          <div class="info-val">Anywhere</div>
        </div>
      </div>
      <div class="info-wrap">
        <div class="info-col">
          <div class="info-label">
            {{ ts('price') }}
          </div>
          <div class="info-val">
            {{ `${price} ETH` }}
          </div>
        </div>
        <div class="info-col">
          <div class="info-label">
            {{ ts('reward.delivery') }}
          </div>
          <div class="info-val">
            {{ delivery }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { toEthDisplay } from '@samatech/vue3-eth'
import { getBackers, getDelivery, urlFromAsset } from '@app/util'
import { IRewardViewModel } from '@app/types'
import { ts } from '../../i18n'

const emit = defineEmits<{
  (e: 'edit'): void
}>()

const { reward } = defineProps<{
  reward: IRewardViewModel
}>()

const assetUrl = computed(() => {
  return reward.image ? urlFromAsset(reward.image) : undefined
})

const price = computed(() => {
  return toEthDisplay(reward.price)
})

const delivery = computed(() => {
  return getDelivery(reward)
})

const backers = computed(() => {
  return getBackers(reward)
})
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.image-overlay {
  background-color: rgba(200, 200, 200, 0.5);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.edit-reward-card {
  position: relative;
  cursor: pointer;
  color: $text1;
  width: 220px;
  min-width: 220px;
  &:hover {
    .image-overlay {
      opacity: 1;
    }
  }
  &.empty {
    opacity: 0;
  }
}
.image-wrap {
  height: 140px;
  background-color: #bec2c4;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.edit-button:hover {
  color: $blue3;
  background-color: white;
}

.reward-content {
  padding: 0 4px;
  height: 140px;
  text-align: left;
}
.reward-name {
  @mixin semibold 15px;
  margin: 6px 0 2px;
}

.reward-description {
  @mixin text 14px;
  min-height: 54px;
}
.info-wrap {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
}
.info-col {
  display: flex;
  flex-direction: column;
  width: 50%;
}
.info-label {
  @mixin semibold 13px;
  color: $text-light;
}
.info-val {
  @mixin text 14px;
}
</style>
