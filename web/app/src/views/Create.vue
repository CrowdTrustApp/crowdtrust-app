<template>
  <div class="project-fields-wrap">
    <div class="project-fields">
      <div class="p-update-title">
        {{ ts('create.title') }}
      </div>
      <div class="p-update-text">
        {{ ts('create.text') }}
      </div>
      <ProjectInfo :infoFeature="infoFeature" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useProjectInfo } from '@app/util-app'
import { ts } from '../i18n'
import ProjectInfo from '../components/project-update/ProjectInfo.vue'

const infoFeature = useProjectInfo()
</script>

<style lang="postcss" scoped>
@import '../css/defines.postcss';
</style>
