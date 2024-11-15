<template>
  <div class="ct-input-wrap">
    <span v-if="prefix" class="ct-input-prefix">
      {{ prefix }}
    </span>
    <input
      ref="inputRef"
      :class="[
        'ct-input',
        inputClass,
        prefix && 'has-prefix',
        suffix && 'has-suffix',
        clearable && 'has-icon-button',
        isEmpty && 'empty',
        (isError || errorBubble) && 'error',
      ]"
      :autocomplete="autocomplete"
      :value="modelValue"
      :type="type"
      :disabled="isDisabled"
      :placeholder="placeholder"
      :name="inputName"
      :required="required"
      @input="handleInput"
      @focusout="emit('focusout', modelValue)"
      @keyup="emit('keyup', $event)"
      @keydown="emit('keydown', $event)"
      @keyup.enter="emit('handle-enter')"
    />
    <label
      v-if="label"
      class="ct-input-label"
      :for="inputName"
      :class="{ active: showTitleTop }"
    >
      <span>{{ label }}</span>
      <span v-if="required" class="ct-input-required">
        {{ requiredStar }}
      </span>
    </label>
    <InfoBubble
      v-if="errorBubble || infoBubble"
      :customIcon="true"
      :message="errorBubble || infoBubble || ''"
      placement="top"
      class="ct-input-suffix bubble"
    >
      <Info :color="errorBubble ? '#f46a6a' : '#5d99b6'" class="error-icon" />
    </InfoBubble>
    <span v-else-if="suffix" class="ct-input-suffix"> {{ suffix }}</span>
    <IconButtonWrap
      v-if="clearable"
      class="clear-button-wrap"
      :disabled="isDisabled"
      @click="clear"
    >
      <Cross />
    </IconButtonWrap>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, useId } from 'vue'
import IconButtonWrap from './IconButtonWrap.vue'
import Cross from '../svg/Cross.vue'
import InfoBubble from './InfoBubble.vue'
import Info from '../svg/Info.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: number | string
    placeholder?: string
    label?: string | null
    type?: string
    name?: string
    autocomplete?: string
    errorBubble?: string | undefined
    infoBubble?: string | undefined
    isError?: boolean
    isDisabled?: boolean
    inputClass?: string | null
    maxLength?: number
    prefix?: string | null
    suffix?: string | null
    required?: boolean
    clearable?: boolean
  }>(),
  {
    modelValue: '',
    placeholder: '',
    label: null,
    type: 'text',
    name: undefined,
    autocomplete: 'off',
    errorBubble: undefined,
    infoBubble: undefined,
    errorMessage: undefined,
    isDisabled: false,
    inputClass: null,
    maxLength: undefined,
    prefix: null,
    suffix: null,
    required: false,
  },
)
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'focusout', value: string | number | undefined): void
  (e: 'keyup', event: KeyboardEvent): void
  (e: 'keydown', event: KeyboardEvent): void
  (e: 'handle-enter'): void
  (e: 'clear'): void
}>()

const { type, name, placeholder, maxLength, modelValue, required } = toRefs(props)

const inputRef = ref<HTMLInputElement>()

defineExpose({ inputRef })

const requiredStar = ` *`

const uid = useId()

const inputName = computed(() => {
  return name.value || `input${uid}`
})

const isEmpty = computed(() => {
  return String(modelValue.value) === ''
})

const showTitleTop = computed(() => {
  return placeholder.value || modelValue.value || modelValue.value === 0
})

const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement)?.value
  if (maxLength.value !== undefined) {
    const limitedValue = value.slice(0, maxLength.value)
    emit('update:modelValue', limitedValue)
    if (inputRef.value) {
      inputRef.value.value = limitedValue
    }
  } else {
    emit('update:modelValue', value)
  }
}

const clear = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.ct-input-wrap {
  position: relative;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;

  :deep(.error-message-wrap) {
    position: absolute;
  }
  .bubble {
    right: 12px;
  }
  :deep(.info-bubble-wrap) {
    @mixin size 18px;
    &:hover {
      svg g {
        fill: rgba($red, 0.7);
      }
    }
  }
}

.ct-input-label {
  @mixin thin 14px;
  position: absolute;
  top: 10px;
  padding: 0 4px;
  margin-left: 8px;
  color: rgba(0, 0, 0, 0.6);
  transition: ease 0.2s all;
  pointer-events: none;
}

.ct-input-label.active,
.ct-input:focus ~ .ct-input-label {
  @mixin thin 11px;
  top: -9px;
  background-color: white;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  color: rgba(0, 0, 0, 0.9);
  padding-top: 2px;
}
.ct-input-required {
  color: $color-error;
}
.ct-input {
  @mixin medium 13px;
  @mixin input;
  box-sizing: border-box;
  color: $text1;
  width: 100%;
  height: 40px;
  border-radius: 2px;
  border: 1px solid $border1;
  outline: none;
  outline-style: none;
  box-shadow: none;
  padding: 8px 10px;
  transition:
    border-color 0.3s,
    background-color 0.3s;

  &::placeholder {
    color: $text1;
    opacity: 0.5;
  }

  &.has-prefix {
    padding-left: 64px;
  }

  &.has-suffix {
    padding-right: 32px;
  }

  &.has-icon-button {
    padding-right: 24px;
  }

  &:focus {
    border-color: $blue1;
    background-color: white;
    &::-webkit-input-placeholder {
      opacity: 0;
      transition: opacity 0.2s ease;
    }
  }

  &.error {
    border: 1px solid $color-error-border;
    color: $color-error-light;
    background-color: $color-error-bg;
    &:not(:disabled)::placeholder {
      color: $color-error-light;
    }
  }

  &:disabled {
    border: 1px solid $border1;
    color: $disabled1;
    -webkit-text-fill-color: $disabled1;
    background-color: $bg-light1;
  }

  /* stylelint-disable */
  &:-internal-autofill-selected,
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    /* Disable background color of input autocomplete */
    box-shadow: 0 0 0 100px #fff inset !important;
    font-size: initial !important;
  }
  /* stylelint-enable */

  &[type='number'] {
    appearance: textfield;
    -moz-appearance: textfield;
  }
  &[type='number']::-webkit-inner-spin-button,
  &[type='number']::-webkit-outer-spin-button {
    appearance: none;
    -webkit-appearance: none;
    margin: 0;
  }
}

.ct-input-prefix {
  @mixin medium 16px;
  color: $text2;
  position: absolute;
  top: 16px;
  left: 14px;
}

.ct-input-suffix {
  @mixin medium 13px;
  color: $text2;
  position: absolute;
  top: 3px;
  right: 6px;
}

:deep(.ibw) {
  @mixin size 20px;
  position: absolute;
  top: 9px;
  right: 4px;
}

.bo {
  border: 1px solid red;
}

@media (max-width: 680px) {
  .ct-input-wrap {
    border-radius: 16px;
  }
}
</style>
