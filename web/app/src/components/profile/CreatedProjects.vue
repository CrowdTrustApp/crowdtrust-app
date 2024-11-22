<template>
  <div class="created-wrap">
    <div class="f-center-col">
      <div v-if="loading" class="loading-wrap">
        <Spinner :size="40" />
      </div>
      <div v-else-if="createdProjects?.length === 0" class="no-text">
        {{ ts('profile.no_created') }}
      </div>
      <div v-else class="projects">
        <ProfileProject
          v-for="project in createdProjects"
          :project="project"
          :edit="true"
        />
      </div>
      <router-link :to="{ name: 'Create' }" class="browse-link">
        <CTButton :text="ts('profile.create')" />
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CTButton from '../widgets/CTButton.vue'
import { ts } from '../../i18n'
import Spinner from '../widgets/Spinner.vue'
import { useProfile } from '@app/util-app'
import ProfileProject from './ProfileProject.vue'

const { createdProjects, loading } = useProfile()
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.created-wrap {
  min-height: 240px;
}
.no-text {
  @mixin semibold 18px;
  color: $text-light;
  text-align: center;
  margin-top: 40px;
}
.browse-link {
  margin-top: 24px;
}
.projects {
  display: flex;
  width: 100%;
  overflow: scroll;
}
.edit-project {
  opacity: 0;
  transition: opacity 0.25s ease;
}
.project {
  margin-right: 8px;
}
</style>
