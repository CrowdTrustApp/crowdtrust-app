<template>
  <div class="checkout-top-wrap">
    <div class="checkout-top f-col">
      <div class="name">
        {{ project.name }}
      </div>
      <div class="blurb">
        {{ project.blurb }}
      </div>
      <div class="time">
        {{ time }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { formatDistance } from 'date-fns'
import { IProjectViewModel } from '@app/types'

const { project } = defineProps<{
  project: IProjectViewModel
}>()

const time = computed(() => {
  const date = formatDistance(
    new Date(),
    (project.start_time + project.duration) * 1000,
    {
      addSuffix: false,
    },
  )
  return `${date} left`
})
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.checkout-top-wrap {
  padding-right: 40px;
}
.checkout-top {
  align-items: center;
  border-bottom: 1px solid $border1;
  padding-bottom: 32px;
}
.name {
  @mixin bold 32px;
}
.blurb {
  @mixin medium 18px;
  margin-top: 8px;
}
.time {
  @mixin text 13px;
  padding-left: 12px;
  margin-top: 6px;
}

@media (max-width: 800px) {
  .checkout-top {
    flex-direction: column;
  }
}
</style>
