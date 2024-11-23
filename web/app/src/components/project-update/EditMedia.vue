<template>
  <div class="edit-media project-fields">
    <div class="images-text">
      {{ ts('edit_project.images') }}
    </div>
    <div class="project-images">
      <EditImage
        v-for="(image, index) in images"
        :key="image.id"
        :asset="image"
        :draggable="true"
        class="image"
        :dragging="draggingIndex !== undefined"
        @dragstart="dragstart($event, index)"
        @drag="drag"
        @dragenter="dragenter($event, index)"
        @dragover="dragover($event, index)"
        @dragleave="dragleave"
        @dragend="dragend"
        @drop="drop($event, index)"
        @delete="confirmDeleteId = image.id"
      />
      <EditImage v-if="uploading" :asset="loadingAsset" :dragging="false" />
      <div v-else-if="images?.length === 0" class="no-images f-center">
        {{ ts('edit_project.no_images') }}
      </div>
    </div>
    <ClickUploadFile @selectFile="selectFile">
      <CTButton :text="ts('upload')" class="upload-bottom" />
    </ClickUploadFile>
    <ConfirmModal
      :show="!!confirmDeleteId"
      :title="ts('you_sure')"
      :text="ts('edit_project.delete_asset')"
      :loading="deleting"
      @confirm="deleteProjectAsset"
      @cancel="confirmDeleteId = undefined"
    />
  </div>
</template>

<script lang="ts" setup>
import { ALL_CONTENT_TYPES, AssetContentType, ICreateAssetRequest } from '@app/types'
import { IValidateMediaError, orderedAssets, validateMedia } from '@app/util'
import { swappedOrder, useEditProject, useListDrag, useProjectAsset } from '@app/util-app'
import { ts } from '../../i18n'
import { computed, ref } from 'vue'
import EditImage, { IEditAsset } from './EditImage.vue'
import CTButton from '../widgets/CTButton.vue'
import ClickUploadFile from '../widgets/ClickUploadFile.vue'
import ConfirmModal from '../widgets/ConfirmModal.vue'

const { createAsset, verifyAsset, deleteAsset } = useProjectAsset()
const { project, updateAssetsOrder, loadProject } = useEditProject()

const error = ref()
const uploading = ref(false)
const deleting = ref(false)
const confirmDeleteId = ref()

const {
  newPos,
  draggingIndex,
  dragstart,
  drag,
  dragenter,
  dragover,
  dragleave,
  drop,
  dragend,
} = useListDrag({
  dataIdentifier: 'text/style-id',
  getDragElement: (e) => e.target as HTMLElement,
  onDrop: (_e, dragIndex, targetIndex) => updateOrder(dragIndex, targetIndex),
})

const loadingAsset: IEditAsset = {
  loading: true,
  id: '',
  content_type: AssetContentType.Jpeg,
  size: 0,
  project_id: '',
}

const images = computed(() => {
  let order = project.value?.assets_order
  if (order) {
    if (newPos.value !== undefined && draggingIndex.value !== undefined) {
      order = swappedOrder(order, draggingIndex.value, newPos.value)
    }
    return orderedAssets(project.value?.assets ?? [], order)
  }
  return []
})

const updateOrder = async (from: number, to: number) => {
  let order = project.value?.assets_order
  if (order) {
    try {
      const newOrder = swappedOrder(order, from, to)
      await updateAssetsOrder(newOrder)
    } catch (e) {
      error.value = ts('errors.Unknown')
    }
  }
}

const selectFile = async (file: File | null | undefined) => {
  if (!project.value) {
    return
  }
  uploading.value = true
  if (file) {
    error.value = undefined
    try {
      const validFile = await validateMedia(
        { size: 20000000, types: ALL_CONTENT_TYPES },
        file,
      )
      const payload: ICreateAssetRequest = {
        content_size: validFile.file.size,
        content_type: validFile.type,
        project_id: project.value.id,
      }
      const result = await createAsset(payload, validFile.file)
      const success = await verifyAsset(result.id)
      if (success) {
        await loadProject(project.value.id)
      }
    } catch (e) {
      const key = (e as IValidateMediaError).fileErrors?.[0]
      error.value = ts(key ? `errors.${key}` : 'errors.Unknown')
    }
  }
  uploading.value = false
}

const deleteProjectAsset = async () => {
  const id = confirmDeleteId.value
  if (!id || !project.value) {
    return
  }
  deleting.value = true
  try {
    await deleteAsset(id)
    await loadProject(project.value.id)
    confirmDeleteId.value = undefined
  } catch (e) {
    error.value = ts('errors.Unknown')
  }
  deleting.value = false
}
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.edit-media.project-fields {
  padding: 16px 32px 120px;
  width: 100%;
}
.images-text {
  @mixin text 15px;
}
.project-images {
  display: flex;
  width: 100%;
  max-width: 100%;
  height: 200px;
  border: 1px solid $border2;
  margin-top: 16px;
  padding: 8px 0 9px 8px;
  overflow-x: auto;
}
.upload-bottom {
  margin-top: 16px;
}
.no-images {
  @mixin semibold 20px;
  width: 100%;
  height: 100%;
  color: $text-light;
}
.image {
  margin-right: 8px;
}
</style>
