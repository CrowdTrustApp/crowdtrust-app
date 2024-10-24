<template>
  <div class="projects-wrap">
    <h1 class="projects-title">
      {{ ts('project.title') }}
    </h1>
    <div class="projects-text">
      <span>{{ ts('project.text') }}</span>
      <router-link :to="{ name: 'Create' }">{{ ts('project.create') }}</router-link>
    </div>
    <ProjectList :projects="state.projects" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue'
import { IListProjectParams, listProjects } from '@app/features'
import ProjectList from '../components/project/ProjectList.vue'
import { ts } from '../i18n'

const state: IListProjectParams = reactive({
  error: undefined,
  loading: false,
  projects: [],
})

onMounted(() => {
  listProjects({}, state)
})
</script>

<style lang="postcss" scoped>
@import '../css/defines.postcss';

.projects-wrap {
  max-width: 1040px;
  padding: 0 24px 120px;
  margin: 0 auto;
  min-height: calc(100vh - 314px);
}
.projects-title {
  @mixin bold 42px;
  margin: 64px 0 16px;
}

.projects-text {
  @mixin text 18px;
  max-width: 460px;
  line-height: 150%;
  a {
    color: $blue3;
    text-decoration: underline;
  }
}
</style>
