<template>
  <div class="profile-wrap">
    <ProfileTop @edit="showEditModal = true" />
    <RouterTabView :routes="routes" variant="link" class="profile-router-tabs" />
    <EditProfileModal :show="showEditModal" @cancel="showEditModal = false" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useProfile } from '@app/util-app'
import { IRoute } from '@app/types'
import RouterTabView from '../components/nav/RouterTabView.vue'
import ProfileTop from '../components/profile/ProfileTop.vue'
import { ts } from '../i18n'
import EditProfileModal from '../components/profile/EditProfileModal.vue'

const { loadProjects } = useProfile()

const routes: IRoute[] = [
  {
    name: 'Backed',
    label: ts('backed'),
    labelClass: 'backed-tab',
  },
  {
    name: 'Created',
    label: ts('created'),
    labelClass: 'created-tab',
  },
  {
    name: 'Settings',
    label: ts('profile.settings'),
    labelClass: 'settings-tab',
  },
]

const showEditModal = ref(false)

onMounted(async () => {
  await loadProjects()
})
</script>

<style lang="postcss" scoped>
.profile-wrap {
  padding-bottom: 80px;
}
.profile-content {
  min-height: 240px;
}
.profile-router-tabs {
  max-width: 1040px;
  margin: 40px auto 0;
  padding: 0 40px;
  :deep(.router-tab-view-tabs) {
    margin-bottom: 24px;
    position: relative;
  }
  &.hide {
    :deep(.router-tab-view-tabs) {
      display: none;
    }
  }
}
@media (max-width: 600px) {
  .profile-router-tabs {
    padding: 0;
    :deep(.router-tab-view-tabs) {
      justify-content: center;
    }
    :deep(.router-tab-view-tab) {
      &.router-tab-view-tab--link {
        margin-right: 16px;
        font-size: 15px;
      }
    }
  }
}
</style>
