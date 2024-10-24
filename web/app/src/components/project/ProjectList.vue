<template>
  <div class="project-list">
    <div v-if="projects.length === 0" class="projects-empty">
      {{ ts('project.empty') }}
    </div>
    <div v-else class="projects f-col">
      <div
        v-for="row in listDimension.rows"
        class="project-row"
        :class="`cols-${listDimension.cols}`"
      >
        <ProjectCard
          v-for="col in listDimension.cols"
          :project="projects[(row - 1) * listDimension.cols + (col - 1)]"
          class="card"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { IProjectViewModel } from '@app/types'
import { useResize } from '@app/util-app'
import { ts } from '../../i18n'
import ProjectCard from './ProjectCard.vue'

const { projects } = defineProps<{
  projects: IProjectViewModel[]
}>()

const { innerWidth } = useResize()

const listDimension = computed(() => {
  let cols = 3
  if (innerWidth.value < 460) {
    cols = 1
  } else if (innerWidth.value < 600) {
    cols = 2
  }
  const rows = Math.ceil(projects.length / cols)
  return { rows, cols }
})
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.projects-empty {
  @mixin semibold 24px;
  color: $text-light2;
  margin-top: 32px;
}
.projects {
  padding-top: 16px;
}
.project-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 32px;
}
.cols-3 .card {
  width: calc(33.3% - 16px);
}
.cols-2 .card {
  width: calc(50% - 16px);
}
.cols-1 .card {
  width: 100%;
}
</style>
