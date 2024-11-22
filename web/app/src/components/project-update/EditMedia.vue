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
        @delete="deleteProjectAsset(image)"
      />
      <EditImage v-if="uploading" :asset="loadingAsset" :dragging="false" />
      <div v-else-if="images?.length === 0" class="no-images f-center">
        {{ ts('edit_project.no_images') }}
      </div>
    </div>
    <ClickUploadFile @selectFile="selectFile">
      <CTButton :text="ts('upload')" class="upload-bottom" />
    </ClickUploadFile>
  </div>
</template>

<script lang="ts" setup>
import { ALL_CONTENT_TYPES, AssetContentType, ICreateAssetRequest } from '@app/types'
import { IValidateMediaError, validateMedia } from '@app/util'
import { swappedOrder, useEditProject, useListDrag, useProjectAsset } from '@app/util-app'
import { ts } from '../../i18n'
import { computed, ref } from 'vue'
import EditImage, { IEditAsset } from './EditImage.vue'
import CTButton from '../widgets/CTButton.vue'
import ClickUploadFile from '../widgets/ClickUploadFile.vue'

const { createAsset, verifyAsset, deleteAsset } = useProjectAsset()
const { project, updateAssetsOrder, recordAddAsset, recordDeleteAsset } = useEditProject()

const error = ref()
const uploading = ref(false)

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
    const assets = order
      .map((id) => {
        const asset = project.value?.assets.find((asset) => asset.id === id)
        return asset ? { ...asset, loading: false } : undefined
      })
      .filter((asset) => !!asset)
    return assets
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
        await recordAddAsset(result)
      }
    } catch (e) {
      const key = (e as IValidateMediaError).fileErrors?.[0]
      error.value = ts(key ? `errors.${key}` : 'errors.Unknown')
    }
  }
  uploading.value = false
}

const deleteProjectAsset = async (asset: IEditAsset) => {
  try {
    asset.loading = true
    await deleteAsset(asset.id)
    await recordDeleteAsset(asset.id)
  } catch (e) {
    error.value = ts('errors.Unknown')
  }
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
