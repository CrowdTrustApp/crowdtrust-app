<template>
  <div
    :class="{ 'drag-upload-wrap': true, 'f-center': true, dragging }"
    :style="{ width, height }"
  >
    <form
      :id="id"
      class="drag-upload-form"
      action=""
      enctype="multipart/form-data"
      @drop="dropUploadImage"
      @dragenter="dragStart"
      @dragleave="dragEnd"
      @dragend="dragEnd"
      @input="handleFileSelect"
    >
      <label class="drag-upload-area" :for="`image-upload-input${id}`">
        <slot>
          <div
            v-if="!loading"
            class="drag-upload-button f-row"
            :class="{ 'has-file': !!preview }"
          >
            <div class="drag-upload-left f-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                class="drag-upload-image"
              >
                <path
                  fill="currentColor"
                  d="m6 18l1.41 1.41L15 11.83V30h2V11.83l7.59 7.58L26 18L16 8L6 18zM6 8V4h20v4h2V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4z"
                />
              </svg>
              <CTAsset
                v-if="preview"
                :asset="preview"
                :canPlayVideo="false"
                class="drag-upload-background f-center"
              />
              <div v-else class="drag-upload-background f-center">
                <slot name="preview" />
              </div>
            </div>
            <div class="drag-upload-right f-center-col">
              <div class="drag-upload-title">
                {{ title }}
              </div>
              <div class="drag-upload-subtitle" v-html="subtitle" />
            </div>
          </div>
        </slot>
        <div v-if="loading" class="drag-upload-spinner f-center-col">
          <Spinner :size="24" color="#3a86ff" />
        </div>
      </label>
      <input
        :id="`drag-upload-input${id}`"
        class="drag-upload overlay"
        type="file"
        :accept="accept"
        :disabled="isDisabled"
        @click="clickInputFile"
      />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import CTAsset from './CTAsset.vue'
import Spinner from './Spinner.vue'

withDefaults(
  defineProps<{
    id?: string
    title: string
    subtitle: string
    isDisabled?: boolean
    preview?: string | null
    loading?: boolean
    accept?: string
    width?: string
    height?: string
  }>(),
  {
    id: '',
    isDisabled: false,
    preview: null,
    loading: false,
    accept: 'image/*',
    width: '100%',
    height: '182px',
  },
)
const emit = defineEmits<{
  (e: 'file-select', value: File): void
}>()

const dragging = ref(false)
const selectedFile = ref<File>()

const handleFileSelect = (e: InputEvent | Event) => {
  if (e && e.target && e.type === 'input') {
    const files = (e.target as HTMLInputElement).files
    if (files) {
      selectedFile.value = files[0]
      emit('file-select', selectedFile.value)
    }
  } else if (e && e.type === 'drop') {
    const files = (e as InputEvent).dataTransfer?.files
    if (files) {
      selectedFile.value = files[0]
      emit('file-select', selectedFile.value)
    }
  }
  dragging.value = false
}
const dragStart = (e: Event) => {
  e.preventDefault()
  dragging.value = true
}
const dragEnd = (e: Event) => {
  e.preventDefault()
  dragging.value = false
}
const dropUploadImage = (e: Event) => {
  e.preventDefault()
  handleFileSelect(e)
}
const clickInputFile = (e: MouseEvent) => {
  if (e && e.target) {
    ;(e.target as HTMLInputElement).value = ''
  }
}
</script>

<style lang="postcss">
@import '../../css/defines.postcss';

$outline: $border1;
$highlight: $primary;

.drag-upload-wrap {
  border: 1px solid $outline;
}
.drag-upload-form {
  position: relative;
  height: 100%;
  width: 100%;
}
.drag-upload-background {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  background-size: contain;
  background-position: center;
  padding: 0;
}
.drag-upload {
  position: absolute;
  cursor: pointer;
  opacity: 0;
}
.drag-upload-button {
  @mixin text 18px;
  color: black;
  text-align: left;
  pointer-events: none;
}
.drag-upload-left {
  width: 35%;
  border-right: 1px solid $outline;
  position: relative;
}
.drag-upload-image {
  position: absolute;
}

.drag-upload-right {
  align-items: flex-start;
  padding: 0 40px;
  width: 65%;
}
.drag-upload-subtitle {
  @mixin text 13px;
  display: inline;
  margin-top: 8px;
  span {
    margin: 0 3px;
    color: $highlight;
  }
}
&.has-file {
  border: $highlight;
}
&.dragging {
  border-color: $highlight;
  .drag-upload-left {
    border-color: $highlight;
  }
}
.drag-upload-spinner {
  text-align: center;
}
.drag-upload-button,
.drag-upload-spinner {
  z-index: 10;
  position: absolute;
  width: 100%;
  height: 100%;
  .loader {
    margin: 0;
  }
  img {
    width: 32px;
    margin-bottom: 6px;
  }
}
</style>
