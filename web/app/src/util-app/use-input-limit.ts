import { computed, ref } from 'vue'

export interface IInputLimitOptions {
  max: number
  min?: number
  label: string
}

export const useInputLimit = (options: IInputLimitOptions) => {
  const { min, max, label } = options
  const text = ref('')

  const suffix = computed(() => {
    return `${text.value.length}/${max}`
  })

  const error = computed(() => {
    if (text.value.length > max) {
      return `${label} length must be less than ${max}`
    } else if (min && text.value.length < min) {
      return `${label} length must be at least ${min}`
    }
    return undefined
  })

  return {
    text,
    suffix,
    error,
  }
}
