<template>
  <div class="reward-info">
    <div class="info-top">
      <DragUploadFile
        :title="ts('reward.image')"
        :subtitle="ts('reward.image_text')"
        :preview="previewUrl"
        height="160px"
        class="image-upload"
        @fileSelect="updateAsset"
      />
      <div class="info-text">
        <CTInput
          v-model="name.text.value"
          :suffix="name.suffix.value"
          :label="ts('name')"
          class="edit-input"
        />
        <CTTextArea
          v-model="description.text.value"
          :suffix="description.suffix.value"
          rows="10"
          :label="ts('description')"
          class="edit-input"
        />
      </div>
    </div>
    <div class="info-bottom">
      <div class="goal bottom-item">
        <div class="label">
          {{ ts('price') }}
        </div>
        <CTInput
          v-model="price"
          suffix="ETH"
          :placeholder="ts('amount')"
          class="bottom-input"
        />
      </div>
      <div class="start-time bottom-item">
        <div class="label">
          {{ ts('reward.delivery') }}
        </div>
        <CTDatePicker
          :date="deliveryTime"
          :placeholder="ts('reward.delivery')"
          :minDate="new Date()"
          :showTime="false"
          @select="deliveryTime = $event"
        />
      </div>
      <div class="duration bottom-item">
        <div class="label">
          {{ ts('reward.backer_limit') }}
        </div>
        <CTInput v-model="backerLimit" :placeholder="ts('amount')" class="bottom-input" />
      </div>
    </div>
    <div class="submit-wrap f-center-col">
      <div class="error" :class="{ show: !!error }">
        {{ error }}
      </div>
      <CTButton
        :animate="submitting"
        :text="ts('submit')"
        class="submit-button"
        @click="submit"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import {
  IValidateMediaError,
  urlFromAsset,
  ValidatedFile,
  validateMedia,
} from '@app/util'
import { ALL_CONTENT_TYPES, IRewardViewModel, IUpdateRewardFeature } from '@app/types'
import { ts } from '../../i18n'
import CTButton from '../widgets/CTButton.vue'
import CTDatePicker from '../widgets/CTDatePicker.vue'
import CTInput from '../widgets/CTInput.vue'
import CTTextArea from '../widgets/CTTextArea.vue'
import DragUploadFile from '../widgets/DragUploadFile.vue'
import { useEditProject } from '@app/util-app'

const emit = defineEmits<{
  (e: 'complete'): void
}>()

const assetBase64 = ref('')
const validatedFile = ref<ValidatedFile | undefined>()
const { project } = useEditProject()

const { feature, reward } = defineProps<{
  reward?: IRewardViewModel
  feature: IUpdateRewardFeature
}>()
const {
  error,
  submitUpdate,
  submitCreate,
  uploadRewardImage,
  replaceRewardImage,
  submitting,
  name,
  description,
  price,
  deliveryTime,
  backerLimit,
} = feature

const previewUrl = computed(() => {
  if (assetBase64.value) {
    return assetBase64.value
  }
  if (reward?.image) {
    return urlFromAsset(reward.image)
  }
  return undefined
})

const parseLimit = () => {
  const limit = parseInt(backerLimit.value)
  if (isNaN(limit)) {
    if (backerLimit.value.includes('.')) {
      return { error: 'Backer limit must be a number without decimals' }
    } else {
      return { error: 'Duration must be a number' }
    }
  } else if (limit > 1000000000) {
    return { error: 'Maximum backers is 1,000,000,000' }
  } else if (limit < 1) {
    return {
      error: 'Backer limit must be at least 1. Leave blank for unlimited backers.',
    }
  }
  return { limit }
}

const parsePrice = () => {
  const valFloat = parseFloat(price.value)
  if (isNaN(valFloat)) {
    return { error: 'Price must be a number' }
  }
  const value = Math.round(1e18 * valFloat).toString()
  if (value.length > 100) {
    return { error: 'Price must be a reasonable number' }
  }
  return { value }
}

const handleAssetSelect = (validFile: ValidatedFile) => {
  const file = validFile.file
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    assetBase64.value = reader.result?.toString() ?? ''
  }
  validatedFile.value = validFile
}

const updateAsset = async (file: File | null | undefined) => {
  if (file) {
    error.value = undefined
    try {
      const validFile = await validateMedia(
        { size: 10000000, types: ALL_CONTENT_TYPES },
        file,
      )
      handleAssetSelect(validFile)
    } catch (e) {
      const key = (e as IValidateMediaError).fileErrors?.[0]
      error.value = ts(key ? `errors.${key}` : 'errors.Unknown')
    }
  }
}

const submit = async () => {
  if (!project.value) {
    return
  }
  error.value = undefined
  const parsedLimit = parseLimit()
  const parsedPrice = parsePrice()
  submitting.value = true

  if (!reward && !validatedFile.value) {
    error.value = 'Reward image required.'
  } else if (name.error.value) {
    error.value = name.error.value
  } else if (description.error.value) {
    error.value = description.error.value
  } else if (!deliveryTime.value) {
    error.value = 'Please select an estimated delivery date.'
  } else if (parsedLimit.error) {
    error.value = parsedLimit.error
  } else if (parsedPrice.error) {
    error.value = parsedPrice.error
  } else if (reward) {
    await submitUpdate(reward.id, {
      name: name.text.value,
      description: description.text.value,
      price: parsedPrice.value as string,
      delivery_time: deliveryTime.value.getTime() / 1000,
      backer_limit: parsedLimit.limit as number,
    })
    if (validatedFile.value) {
      await replaceRewardImage(validatedFile.value, reward)
    }
  } else {
    const id = await submitCreate(project.value, {
      name: name.text.value,
      description: description.text.value,
      price: parsedPrice.value as string,
      delivery_time: Math.round(deliveryTime.value.getTime() / 1000),
      backer_limit: parsedLimit.limit as number,
    })
    if (id && validatedFile.value) {
      await uploadRewardImage(validatedFile.value, id)
    }
  }
  submitting.value = false
  if (!error.value) {
    emit('complete')
  }
}
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.project-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.image-upload {
  margin-top: 16px;
}
.edit-input {
  margin-top: 16px;
  width: 100%;
}
.info-bottom {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
.bottom-item {
  text-align: center;
}
.bottom-input :deep(input) {
  width: 140px;
}
.label {
  @mixin semibold 15px;
  margin-bottom: 4px;
}
.start-time {
  margin: 0 16px;
  :deep(input) {
    width: 180px;
  }
}
.category {
  margin-left: 16px;
}
.submit-wrap {
  width: 100%;
}
.submit-button {
  padding-left: 24px;
  padding-right: 24px;
}
.error {
  @mixin text 15px;
  color: $red;
  text-align: center;
  max-width: 400px;
  width: 100%;
  min-height: 44px;
  padding: 12px 0;
  opacity: 0;
  transition: opacity 0.3s ease;
  &.show {
    opacity: 1;
  }
}
@media (max-width: 700px) {
  .info-bottom {
    flex-wrap: wrap;
    max-width: 420px;
  }
  .start-time {
    margin: 16px 16px 0 0;
  }
  .duration {
    margin-top: 16px;
  }
}
</style>
