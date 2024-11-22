<template>
  <div class="project-fields-wrap">
    <ProjectInfo :infoFeature="infoFeature" :projectId="project?.id" />
  </div>
</template>

<script lang="ts" setup>
import { useEditProject, useProjectInfo } from '@app/util-app'
import ProjectInfo from './ProjectInfo.vue'

const { project } = useEditProject()

const infoFeature = useProjectInfo(project.value)
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';
</style>
