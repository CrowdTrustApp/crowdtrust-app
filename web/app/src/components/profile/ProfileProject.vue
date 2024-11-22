<template>
  <router-link
    v-if="project"
    :to="{ name: edit ? 'Edit' : 'Project', params: { id: project.id } }"
  >
    <div class="project-card">
      <div class="image-wrap">
        <img :src="getMainImage(project)" />
        <div class="image-overlay overlay f-center-col">
          <div class="button1 view-button">
            {{ ts(edit ? 'edit' : 'view') }}
          </div>
          <router-link :to="{ name: 'Project', params: { id: project.id } }" @click.stop>
            <div v-if="edit" class="button1 created-view">
              {{ ts('view') }}
            </div>
          </router-link>
        </div>
        <div class="active-wrap">
          <div class="active">
            {{ project.status }}
          </div>
          <div class="dot" :class="project.status"></div>
        </div>
      </div>
      <div class="project-content">
        <div class="funded-wrap">
          <div class="raised">
            {{ `${raised} ETH` }}
          </div>
          <div class="funded">
            {{ `${progress}% funded` }}
          </div>
        </div>
        <div class="progress-wrap">
          <div class="progress" :style="{ width: `${Math.min(progress, 100)}%` }"></div>
        </div>
        <h3 class="project-name">
          {{ project.name }}
        </h3>
        <div class="project-blurb">
          {{ project.blurb }}
        </div>
      </div>
    </div>
  </router-link>
  <div v-else class="project-card empty">
    <div class="image-wrap"></div>
    <div class="project-content"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { toEthDisplay } from '@samatech/vue3-eth'
import { getMainImage, getProgress } from '@app/util'
import { IProjectViewModel } from '@app/types'
import { ts } from '../../i18n'

const { project } = defineProps<{
  project: IProjectViewModel | undefined
  edit?: boolean
}>()

const progress = computed(() => {
  return getProgress(project)
})

const raised = computed(() => {
  if (!project) return 0
  return toEthDisplay(project.total_pledged)
})
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.image-overlay {
  background-color: rgba(200, 200, 200, 0.5);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.active {
  color: $text3;
  opacity: 0;
  transition: opacity 0.25 ease;
}
.active-wrap {
  @mixin medium 13px;
  position: absolute;
  right: 8px;
  top: 6px;
  display: flex;
  align-items: center;
}

.project-card {
  position: relative;
  cursor: pointer;
  color: $text1;
  width: 200px;
  margin-right: 12px;
  &:hover {
    .image-overlay {
      opacity: 1;
    }
    .active {
      opacity: 1;
    }
  }
  &.empty {
    opacity: 0;
  }
}
.image-wrap {
  height: 180px;
  background-color: #bec2c4;
  position: relative;
  border-radius: 12px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.view-button:hover {
  color: $blue3;
  background-color: white;
}
.created-view {
  margin-top: 8px;
}

.project-content {
  padding: 0 6px;
  height: 140px;
}
.project-name {
  @mixin semibold 18px;
  margin: 8px 0 4px;
  max-width: 90%;
}

.project-blurb {
  @mixin text 15px;
  max-width: 90%;
}
.dot {
  @mixin size 12px;
  border-radius: 50%;
  background-color: $disabled1;
  border: 1.5px solid white;
  margin-left: 4px;
  &.Active {
    background-color: $blue1;
  }
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
.funded-wrap {
  @mixin medium 13px;
  margin-top: 8px;
  display: flex;
  color: $text3;
}
.raised {
  padding-right: 8px;
  border-right: 1px solid rgba(0, 0, 0, 0.25);
}
.funded {
  padding-left: 8px;
}
</style>
