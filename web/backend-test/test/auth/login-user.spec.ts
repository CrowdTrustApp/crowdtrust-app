import { ILoginUserApiRequest, ILoginUserApiResponse } from '@app/types'
import { commonRegex, omit } from '@app/util'
import {
  AppDbResetService,
  signMessage,
  TEST_PRIVATE_KEY1,
  testagent,
  TestAgent,
  USER1_PRIVATE_KEY,
} from '../helpers'
import { testConfig } from '../test.config'
import { beforeAll, beforeEach, describe, expect, test } from 'vitest'

describe('Login User', () => {
  const testEndpoint = '/api/auth/logins'
  let api: TestAgent
  let testHelperApiUrl: string
  let dbResetService: AppDbResetService
  let payload: ILoginUserApiRequest
  let userEthAddress: string

  const sign = (key: string, address: string) => {
    const message = `Log in to CrowdTrust with ${address}`
    return signMessage(key, message)
  }

  beforeAll(() => {
    api = testagent(testConfig.get('apiUrl'))
    testHelperApiUrl = testConfig.get('apiTestHelperUrl')
    dbResetService = new AppDbResetService(testHelperApiUrl)
  })

  beforeEach(async () => {
    await dbResetService.resetDb()
    userEthAddress = '0x0bfcaae5Abf40A828e6b37379F99dCbEDA712345'
    payload = { email: 'user1@crowdtrust.app', password: 'password1' }
  })

  describe('when requestor is admin', () => {
    test('logs in user with password', async () => {
      payload = { email: 'admin1@crowdtrust.app', password: 'admin.password1' }
      const response = await api.post(testEndpoint).send(payload).expect(201)
      const body: ILoginUserApiResponse = response.body

      expect(body.auth_token).toMatch(new RegExp(commonRegex.authToken))
    })
  })

  describe('when requestor is user', () => {
    test('logs in user with password', async () => {
      const response = await api.post(testEndpoint).send(payload).expect(201)
      const body: ILoginUserApiResponse = response.body

      expect(body.auth_token).toMatch(new RegExp(commonRegex.authToken))
    })

    test('logs in user with eth_address', async () => {
      payload = {
        eth_address: userEthAddress,
        eth_address_signature: await sign(USER1_PRIVATE_KEY, userEthAddress),
      }
      const response = await api.post(testEndpoint).send(payload).expect(201)
      const body: ILoginUserApiResponse = response.body

      expect(body.auth_token).toMatch(new RegExp(commonRegex.authToken))
    })
  })

  describe('when request is not valid', () => {
    test('when user does not exist', () => {
      payload.email = 'missing@email.com'

      return api.post(testEndpoint).send(payload).expect(401, {
        status: 401,
        message: 'Login failed',
        code: 'InvalidAuth',
      })
    })

    test('when password is incorrect', () => {
      payload.password = '12345678'

      return api.post(testEndpoint).send(payload).expect(401, {
        status: 401,
        message: 'Login failed',
        code: 'InvalidAuth',
      })
    })

    test('when email is not an email', () => {
      payload.password = '1234'

      return api.post(testEndpoint).send(payload).expect(400, {
        status: 400,
        message: 'Failed to validate request',
        code: 'InvalidFormData',
      })
    })

    test('when email is missing in payload', () => {
      const noEmail = omit(payload, 'email')

      return api.post(testEndpoint).send(noEmail).expect(400, {
        status: 400,
        message: 'Signature or email/password required',
        code: 'InvalidAuth',
      })
    })

    test('when signature is missing', async () => {
      const missing = {
        eth_address: userEthAddress,
      }
      await api.post(testEndpoint).send(missing).expect(400, {
        status: 400,
        message: 'Signature required when updating eth_address',
        code: 'SignatureRequired',
      })
    })

    test('when signed by the wrong wallet', async () => {
      payload = {
        eth_address: userEthAddress,
        eth_address_signature: await sign(TEST_PRIVATE_KEY1, userEthAddress),
      }
      await api.post(testEndpoint).send(payload).expect(400, {
        status: 400,
        message: 'Failed to verify signature',
        code: 'InvalidSignature',
      })
    })

    test('when password is missing in payload', () => {
      const noPayload = omit(payload, 'password')

      return api.post(testEndpoint).send(noPayload).expect(400, {
        status: 400,
        message: 'Signature or email/password required',
        code: 'InvalidAuth',
      })
    })
  })
})
