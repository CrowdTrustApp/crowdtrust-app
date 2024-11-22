import { ComputedRef, Ref } from 'vue'

export interface IInputLimitOptions {
  max: number
  min?: number
  label: string
  initial?: string
}

export interface IInputLimit {
  text: Ref<string>
  suffix: ComputedRef<string>
  error: Ref<string | undefined>
}
