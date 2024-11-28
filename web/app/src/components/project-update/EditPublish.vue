<template>
  <div class="edit-publish project-fields">
    <div class="publish-info">
      <div class="info-left">
        {{ ts('create.start') }}
      </div>
      <div class="info-right">
        {{ startDate }}
      </div>
    </div>
    <div class="publish-info">
      <div class="info-left">
        {{ ts('edit_project.end') }}
      </div>
      <div class="info-right">
        {{ endDate }}
      </div>
    </div>
    <div class="publish-info">
      <div class="info-left">
        {{ ts('blockchain') }}
      </div>
      <div class="info-right">
        {{ blockchainStatus }}
      </div>
    </div>
    <div class="publish-info explorer-link">
      <a
        v-if="project?.transaction_hash"
        target="_blank"
        :href="transactionLink(project.transaction_hash)"
      >
        Etherscan ↗
      </a>
    </div>
    <div v-if="project.status === ProjectStatus.Initial" class="review publish-wrap">
      <div class="publish-text">
        {{ ts('edit_project.submit_text') }}
      </div>
      <CTButton
        v-if="!transactionSubmitted"
        :text="ts('submit')"
        :disabled="submitting"
        :animate="submitting"
        class="publish-button"
        @click="submit"
      />
    </div>
    <div
      v-else-if="project.status === ProjectStatus.Approved"
      class="publish publish-wrap"
    >
      <div class="publish-text">
        {{ ts('edit_project.publish_text') }}
      </div>
      <CTButton
        :text="ts('publish')"
        :animate="submitting"
        :disabled="submitting"
        class="publish-button"
        @click="publish"
      />
    </div>
    <div
      v-else-if="project.status === ProjectStatus.Prelaunch"
      class="publish publish-wrap"
    >
      <div class="publish-text">
        {{ ts('edit_project.unpublish_text') }}
      </div>
      <CTButton
        :text="ts('unpublish')"
        :animate="submitting"
        :disabled="submitting"
        class="publish-button"
        @click="unpublish"
      />
    </div>
    <div v-else-if="project.status === ProjectStatus.Review" class="review publish-wrap">
      <div class="publish-text">
        {{ ts('edit_project.review_text') }}
      </div>
    </div>
    <div v-else-if="project.status === ProjectStatus.Denied" class="denied publish-wrap">
      <div class="publish-text">
        {{ ts('edit_project.denied_text') }}
      </div>
    </div>
    <div v-else-if="project.status === ProjectStatus.Active" class="denied publish-wrap">
      <div class="publish-text">
        {{ ts('edit_project.active_text') }}
      </div>
    </div>
    <div
      v-else-if="project.status === ProjectStatus.Complete"
      class="denied publish-wrap"
    >
      <div class="publish-text">
        {{ ts('edit_project.complete_text') }}
      </div>
    </div>
    <div class="error" :class="{ show: !!error }">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { format } from 'date-fns'
import { transactionLink, useEditProject, useEth } from '@app/util-app'
import { ts } from '../../i18n'
import CTButton from '../widgets/CTButton.vue'
import {
  BlockchainStatus,
  IProjectViewModel,
  IUpdateProjectApiRequest,
  ProjectStatus,
} from '@app/types'
import { apiUpdateProject } from '@app/api'
import { submitProject } from '../../util-app/blockchain/project'

const { project, loadProject } = useEditProject()
const { pollTransaction } = useEth()

const submitting = ref(false)
const error = ref()

const formatUtcSeconds = (seconds: number) => {
  const date = new Date(seconds * 1000)
  return format(date, 'yyyy/MM/dd HH:mm xxx')
}

const startDate = computed(() => {
  if (!project.value) {
    return '?'
  }
  return formatUtcSeconds(project.value.start_time)
})

const endDate = computed(() => {
  if (!project.value) {
    return '?'
  }
  return formatUtcSeconds(project.value.start_time + project.value.duration)
})

const blockchainStatus = computed(() => {
  const status = project.value?.blockchain_status
  return status ? ts(`blockchain_status.${status}`) : 'Unknown'
})

const transactionSubmitted = computed(() => {
  return (
    project.value?.blockchain_status === BlockchainStatus.Pending ||
    project.value?.blockchain_status === BlockchainStatus.Success
  )
})

const updateProject = async (payload: IUpdateProjectApiRequest) => {
  if (!project.value) {
    return
  }
  submitting.value = true
  try {
    await apiUpdateProject(project.value.id, payload)
    await loadProject(project.value.id)
  } catch (e) {
    console.log('Update error:', e)
    error.value = ts('errors.Unknown')
  }
  submitting.value = false
}

const validateProject = (project: IProjectViewModel): boolean => {
  if (project.rewards.length === 0) {
    error.value = ts('errors.no_reward')
    return false
  } else if (project.assets.length === 0) {
    error.value = ts('errors.no_media')
    return false
  }
  return true
}

const submit = async () => {
  if (!project.value || !validateProject(project.value)) {
    return
  }
  error.value = undefined
  submitting.value = true
  try {
    const response = await submitProject(project.value)
    if (response) {
      await updateProject({
        transaction_hash: response.hash,
        blockchain_status: BlockchainStatus.Pending,
      })
      const complete = await pollTransaction(response.hash)
      if (complete) {
        await updateProject({
          blockchain_status: BlockchainStatus.Success,
          status: ProjectStatus.Review,
        })
      } else {
        error.value = 'Failed to confirm transaction'
        await updateProject({ blockchain_status: BlockchainStatus.Error })
      }
    }
  } catch (e) {
    error.value = e
  }
  submitting.value = false
}

const publish = async () => {
  error.value = undefined
  await updateProject({ status: ProjectStatus.Prelaunch })
}

const unpublish = async () => {
  await updateProject({ status: ProjectStatus.Approved })
}
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.edit-publish.project-fields {
  padding: 0px 0 120px;
  width: 100%;
}
.publish-text {
  @mixin text 17px;
  line-height: 145%;
  max-width: 480px;
  margin: 16px auto 0;
}
.publish-button {
  margin-top: 24px;
}
.publish-info {
  @mixin text 15px;
  display: flex;
  margin-top: 8px;
}
.info-left {
  font-weight: bold;
  margin-right: 8px;
  text-align: right;
  min-width: 80px;
}
</style>
