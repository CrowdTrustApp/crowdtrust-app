import { reactive } from 'vue'
import {
  IAdminCheck,
  IAdminCheckOptional,
  IAdminDate,
  IAdminDateOptional,
  IAdminField,
  IAdminFieldOptional,
  IAdminForm,
  IAdminMultiSelect,
  IAdminMultiSelectOptional,
  IAdminSelect,
  IAdminSelectOptional,
  ValidateResult,
  Validator,
} from '@app/types'
import { checkError } from './validate-fields'
import { formatISO } from 'date-fns'

export const makeField = (values: IAdminFieldOptional) =>
  reactive<IAdminField>({
    required: true,
    input: '',
    error: null,
    ...values,
  })

export const makeSelect = (values: IAdminSelectOptional) =>
  reactive<IAdminSelect>({
    required: true,
    input: undefined,
    error: null,
    ...values,
  })

export const makeMultiSelect = (values: IAdminMultiSelectOptional) =>
  reactive<IAdminMultiSelect>({
    required: true,
    input: [],
    error: null,
    ...values,
  })

export const makeCheck = (values: IAdminCheckOptional) =>
  reactive<IAdminCheck>({
    ...values,
    get input(): string {
      return String(this.checked)
    },
  })

export const makeDate = (values: IAdminDateOptional) =>
  reactive<IAdminDate>({
    required: true,
    input: '',
    error: null,
    ...values,
  })

// TODO add support for IAdminCheckbox
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateFields = <T extends Record<string, any>>(
  form: IAdminForm,
  data: T,
) => {
  for (const [key, value] of Object.entries(data)) {
    if (form[key]) {
      if (value instanceof Date) {
        form[key].input = formatISO(valid)
      } else if (Array.isArray(value)) {
        form[key].input = value
      } else {
        const val = value === undefined || value === null ? '' : value
        form[key].input = val.toString()
      }
    }
  }
}

export const validateFields = <T extends IAdminForm>(form: T): ValidateResult | null => {
  for (const field of Object.values(form)) {
    if (field.validators) {
      if (!field.input && !field.required) {
        continue
      }
      const error = checkError(
        field.label,
        field.input?.toString(),
        field.validators as Validator[],
      )
      if (error) {
        return error
      }
    }
  }
  return null
}
