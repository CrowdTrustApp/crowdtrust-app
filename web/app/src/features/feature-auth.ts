import { apiLoginUser, apiRegisterUser, apiUserExists } from '@app/api'
import { computed, ref } from 'vue'
import { errorToKey } from '@app/util'
import { ILoginUserApiRequest, IRegisterUserApiRequest } from '@app/types'
import { store } from '@app/store'

export const authErrorKey = ref<string | undefined>()

export const loggedIn = computed(() => {
  return store.auth.loggedIn.value
})

export const userExists = async (ethAddress: string): Promise<boolean> => {
  authErrorKey.value = undefined
  try {
    const res = await apiUserExists({ eth_address: ethAddress })
    return res.exists
  } catch (e) {
    authErrorKey.value = errorToKey(e)
    return false
  }
}

const validatePassword = (password: string): boolean => {
  if (password.length < 8 || password.length > 50) {
    authErrorKey.value = 'errors.password_length'
    return false
  }
  return true
}

export const registerUser = async (payload: IRegisterUserApiRequest): Promise<void> => {
  authErrorKey.value = undefined
  if (!validatePassword(payload.password)) {
    return
  }
  try {
    await apiRegisterUser(payload)
    await loginUser({ email: payload.email, password: payload.password })
  } catch (e) {
    authErrorKey.value = errorToKey(e)
  }
}

export const loginUser = async (payload: ILoginUserApiRequest): Promise<void> => {
  authErrorKey.value = undefined
  try {
    const authRes = await apiLoginUser(payload)
    if (authRes.auth_token) {
      store.auth.logIn(authRes.auth_token)
    }
  } catch (e) {
    authErrorKey.value = errorToKey(e)
  }
}
