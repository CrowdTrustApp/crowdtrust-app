<template>
  <div v-if="projectState.loading" class="spinner-wrap">
    <Spinner :size="40" color="rgb(1, 98, 162)" />
  </div>
  <div v-else-if="projectState.project" class="checkout-wrap">
    <CheckoutTop :project="projectState.project" />
    <CheckoutCart :project="projectState.project" :pledgeState="pledgeState" />
    <CheckoutRewards
      :projectId="projectState.project.id"
      :rewards="projectState.project.rewards ?? []"
    />
    <router-link :to="{ name: 'Project', params: { id: projectState.project.id } }">
      <CTButton :text="ts('checkout.to_project')" class="back-button" />
    </router-link>
  </div>
  <ProjectNotFound v-else />
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { getPledge, getProject, IGetPledgeParams, IGetProjectParams } from '@app/features'
import CheckoutTop from '../components/checkout/CheckoutTop.vue'
import Spinner from '../components/widgets/Spinner.vue'
import ProjectNotFound from '../components/project/ProjectNotFound.vue'
import CheckoutRewards from '../components/checkout/CheckoutRewards.vue'
import CheckoutCart from '../components/checkout/CheckoutCart.vue'
import CTButton from '../components/widgets/CTButton.vue'
import { ts } from '../i18n'

const route = useRoute()

const projectState: IGetProjectParams = reactive({
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
    await getProject(projectId, projectState)
    await getPledge(projectId, pledgeState)
  } else {
    projectState.loading = false
    pledgeState.loading = false
  }
})
</script>

<style lang="postcss" scoped>
@import '../css/defines.postcss';

.checkout-wrap {
  min-height: calc(100vh - 360px);
  max-width: 1040px;
  padding: 64px 24px 120px;
  margin: 0 auto;
  text-align: center;
}
.back-button {
  margin-top: 40px;
}

.spinner-wrap {
  min-height: calc(100vh - 320px);
  text-align: center;
}
</style>
