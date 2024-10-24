<template>
  <div class="project-top">
    <div class="image-wrap">
      <img :src="getMainImage(project)" />
    </div>
    <div class="top-detail f-col">
      <div class="name">
        {{ project.name }}
      </div>
      <div class="blurb">
        {{ project.blurb }}
      </div>
      <div class="info1">
        <div class="backers">
          {{ `${project.backer_count} backers` }}
        </div>
        <div class="time">
          {{ time }}
        </div>
      </div>
      <div class="pledged">
        {{ raised }}
      </div>
      <div class="goal">
        {{ goal }}
      </div>
      <div class="progress-wrap">
        <div class="progress" :style="{ width: `${Math.min(progress, 100)}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { formatDistance } from 'date-fns'
import { IProjectViewModel } from '@app/types'
import { toEthDisplay } from '@samatech/vue3-eth'
import { getMainImage } from '@app/util'

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

const progress = computed(() => {
  if (!project) return 0
  const pledged = BigInt(project.total_pledged)
  const goal = BigInt(project.funding_goal)
  return Math.min(Number(pledged / goal) * 100)
})

const raised = computed(() => {
  if (!project) return '0 ETH'
  return `${toEthDisplay(project.total_pledged)} ETH`
})

const goal = computed(() => {
  if (!project) return '0 ETH goal'
  return `raised of ${toEthDisplay(project.funding_goal)} ETH goal`
})
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.project-top {
  display: flex;
  padding-bottom: 40px;
  border-bottom: 1px solid $border1;
}
.image-wrap {
  position: relative;
  width: 55%;
  background-color: #dee2e4;
  position: relative;
  height: 280px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.top-detail {
  padding-left: 24px;
}
.name {
  @mixin bold 36px;
}
.blurb {
  @mixin medium 18px;
  margin-top: 12px;
}
.info1 {
  @mixin text 19px;
  display: flex;
  margin-top: 20px;
}
.backers {
  padding-right: 12px;
  border-right: 1px solid $text-light2;
}
.time {
  padding-left: 12px;
}

.pledged {
  @mixin bold 24px;
  color: $blue2;
  margin-top: auto;
}
.goal {
  @mixin text 16px;
  margin-top: 0px;
}
.progress-wrap {
  margin-top: 4px;
  height: 2px;
  background-color: rgba(0, 0, 0, 0.25);
  position: relative;
}
.progress {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: $blue2;
}

@media (max-width: 800px) {
  .project-top {
    flex-direction: column;
  }
  .image-wrap {
    margin: 0 auto;
    width: 100%;
    max-width: 560px;
  }
  .top-detail {
    margin: 16px auto 0;
    width: 100%;
    max-width: 560px;
  }
}
</style>
