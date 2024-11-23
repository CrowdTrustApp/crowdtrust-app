export type ErrorData = Record<string, string | number>

export type ValidateData = string | null | undefined

export interface ValidateError {
  key: string
  data: ErrorData
}

export type ValidateResult = ValidateError | undefined

export type Validator = (name: string, data: ValidateData) => ValidateResult
