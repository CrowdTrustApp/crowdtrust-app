import { IInputLimit, IInputLimitOptions } from '@app/types'
import { computed, ref } from 'vue'

export const useInputLimit = (options: IInputLimitOptions): IInputLimit => {
  const { min, max, label } = options
  const text = ref(options.initial ?? '')

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
