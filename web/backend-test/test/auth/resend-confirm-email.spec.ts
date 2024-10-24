import { AppDbResetService, testagent, TestAgent, userAuthHeader } from '../helpers'
import { testConfig } from '../test.config'
import { beforeAll, beforeEach, describe, test } from 'vitest'

describe('Resend confirm Email', () => {
  const testEndpoint = '/api/auth/resend-confirm-email'
  let api: TestAgent
  let testHelperApiUrl: string
  let dbResetService: AppDbResetService
  let userAuth: string

  beforeAll(() => {
    api = testagent(testConfig.get('apiUrl'))
    testHelperApiUrl = testConfig.get('apiTestHelperUrl')
    dbResetService = new AppDbResetService(testHelperApiUrl)
  })

  beforeEach(async () => {
    await dbResetService.resetDb()
  })

  test('return 200 when resend confirm email', () => {
    userAuth = userAuthHeader('00e8ee0b-843b-43e7-84c1-6d7a64cd5cfd')
    return api.post(testEndpoint).set('Authorization', userAuth).expect(200)
  })

  test('return 400 when email is already confirmed', () => {
    userAuth = userAuthHeader('45013993-2a1a-4ee5-8dbd-b4b63d9af34f')
    return api.post(testEndpoint).set('Authorization', userAuth).expect(400, {
      code: 'AlreadyConfirmed',
      message: 'Resend fail',
      status: 400,
    })
  })

  test('when user is not authorized', () => {
    return api.post(testEndpoint).expect(401, {
      code: 'Unauthorized',
      message: 'Unauthorized',
      status: 401,
    })
  })
})
