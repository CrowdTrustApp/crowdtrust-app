import { store } from '@app/store'
import { ApiResponse } from '@app/types'
import { API_HOST } from '@app/util'
import { CTApi } from '@app/util'

export const API_URL = `${API_HOST}/api/`

export const rootApi = new CTApi({
  baseUrl: API_URL,
  userToken: store.auth.token,
})

export const setupApiInterceptors = (api: CTApi) => {
  api.interceptResponse(async (res: Response): Promise<ApiResponse> => {
    if (res.status === 401) {
      if (
        // Don't redirect if we're already on the login page
        location.pathname !== '/login' &&
        // Login 401 is handled within the Login and ResetPassword component
        !res.url.match(/^.*?\/auth\/logins(\/passwords)?$/) &&
        // External 401 response should not trigger logout
        res.url.startsWith(API_URL)
      ) {
        // Can't use redirectToLogin outside a component, so do it manually
        store.auth.setLoginRedirect(location.pathname)
        store.auth.logOut()
      }

      throw res
    }
    return res as ApiResponse
  })
}
