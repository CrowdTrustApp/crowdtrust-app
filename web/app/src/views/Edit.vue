<template>
  <div class="edit-project-wrap project-fields">
    <div class="edit-project">
      <div class="p-update-title">
        {{ ts('edit_project.title') }}
      </div>
      <div class="p-update-text">
        {{ ts('edit_project.text') }}
      </div>
      <div v-if="loading">
        <Spinner color="rgb(1, 98, 162)" />
      </div>
      <div v-else-if="project" class="tabs-wrap">
        <RouterTabView
          :routes="routes"
          :slotted="true"
          variant="link"
          class="edit-router-tabs"
        />
      </div>
      <div v-else class="no-project">
        {{ ts('edit_project.no') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IRoute } from '@app/types'
import RouterTabView from '../components/nav/RouterTabView.vue'
import { ts } from '../i18n'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Spinner from '../components/widgets/Spinner.vue'
import { useEditProject } from '@app/util-app'

const route = useRoute()
const { loading, project, loadProject } = useEditProject()

const routes: IRoute[] = [
  {
    name: 'EditInfo',
    label: ts('info'),
    labelClass: 'info-tab',
  },
  {
    name: 'EditMedia',
    label: ts('media'),
    labelClass: 'media-tab',
  },
  {
    name: 'EditRewards',
    label: ts('rewards'),
    labelClass: 'rewards-tab',
  },
  {
    name: 'EditPublish',
    label: ts('publish'),
    labelClass: 'publish-tab',
  },
]

onMounted(async () => {
  await loadProject(route.params.id as string)
})
</script>

<style lang="postcss" scoped>
@import '../css/defines.postcss';

.edit-project {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}
.p-update-text {
  text-align: center;
  width: 100%;
}
.edit-router-tabs {
  margin-top: 16px;
}
.tabs-wrap {
  width: 100%;
}
:deep(.router-tab-view) .router-tab-view-tabs {
  width: 100%;
  justify-content: center;
  margin-bottom: 24px;
}
.no-project {
  @mixin semibold 24px;
  margin-top: 40px;
  color: $text-light;
  text-align: center;
}
</style>
