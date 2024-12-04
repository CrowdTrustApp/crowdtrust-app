<template>
  <div v-if="state.loading" class="spinner-wrap">
    <Spinner :size="40" color="rgb(1, 98, 162)" />
  </div>
  <div v-else-if="state.project" class="project-wrap">
    <ProjectTop :project="state.project" />
    <ProjectRewards
      :projectId="state.project.id"
      :rewards="state.project.rewards ?? []"
      :pledge="pledgeState.pledge"
    />
    <ProjectDetail :project="state.project" />
  </div>
  <ProjectNotFound v-else />
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { getPledge, getProject, IGetPledgeParams, IGetProjectParams } from '@app/features'
import ProjectTop from '../components/project/ProjectTop.vue'
import { onMounted, reactive } from 'vue'
import Spinner from '../components/widgets/Spinner.vue'
import ProjectRewards from '../components/project/ProjectRewards.vue'
import ProjectDetail from '../components/project/ProjectDetail.vue'
import ProjectNotFound from '../components/project/ProjectNotFound.vue'

const route = useRoute()

const state: IGetProjectParams = reactive({
  loading: true,
  error: undefined,
  project: undefined,
})
const pledgeState: IGetPledgeParams = reactive({
  loading: true,
  error: undefined,
  pledge: undefined,
})

onMounted(async () => {
  if (route.params.id) {
    const projectId = route.params.id as string
    await getProject(projectId, state)
    await getPledge(projectId, pledgeState)
  } else {
    state.loading = false
    pledgeState.loading = false
  }
})
</script>

<style lang="postcss" scoped>
@import '../css/defines.postcss';

.project-wrap {
  min-height: calc(100vh - 360px);
  max-width: 1040px;
  padding: 96px 24px 120px;
  margin: 0 auto;
}
.spinner-wrap {
  min-height: calc(100vh - 320px);
  text-align: center;
}
</style>
