import { IRegisterUserApiRequest, IRegisterUserApiResponse } from '@app/types'
import { commonRegex, omit } from '@app/util'
import {
  AppDbResetService,
  registerSignature,
  TEST_ADDRESS1,
  TEST_ADDRESS2,
  TEST_PRIVATE_KEY1,
  TEST_PRIVATE_KEY2,
  testagent,
  TestAgent,
  USER3_PRIVATE_KEY,
} from '../helpers'
import { testConfig } from '../test.config'
import { describe, expect, test, beforeAll, beforeEach } from 'vitest'

describe('Register User', () => {
  const testEndpoint = '/api/users/registrations'
  let api: TestAgent
  let testHelperApiUrl: string
  let dbResetService: AppDbResetService
  let payload: IRegisterUserApiRequest

  beforeAll(() => {
    api = testagent(testConfig.get('apiUrl'))
    testHelperApiUrl = testConfig.get('apiTestHelperUrl')
    dbResetService = new AppDbResetService(testHelperApiUrl)
  })

  beforeEach(async () => {
    await dbResetService.resetDb()
    payload = {
      email: 'test@test.com',
      password: '12345678',
      eth_address: TEST_ADDRESS1,
      eth_address_signature: await registerSignature(TEST_PRIVATE_KEY1, TEST_ADDRESS1),
    }
  })

  test('registers user', async () => {
    const response = await api.post(testEndpoint).send(payload).expect(201)
    const body: IRegisterUserApiResponse = response.body

    expect(body.id).toMatch(new RegExp(commonRegex.uuid))
  })

  describe('when request is not valid', () => {
    test('returns 400 code when password length is invalid', async () => {
      // Password too short
      payload.password = '1234'
      await api.post(testEndpoint).send(payload).expect({
        status: 400,
        message: 'Failed to validate request',
        code: 'InvalidFormData',
      })

      // Password too long
      payload.password = '12345678901234567890123456789012345678901234567890z'
      return api.post(testEndpoint).send(payload).expect({
        status: 400,
        message: 'Failed to validate request',
        code: 'InvalidFormData',
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
        message: 'missing field email',
        code: 'InvalidFormData',
      })
    })

    test('when password is missing in payload', () => {
      const noPayload = omit(payload, 'password')

      return api.post(testEndpoint).send(noPayload).expect(400, {
        status: 400,
        message: 'missing field password',
        code: 'InvalidFormData',
      })
    })

    test('when eth address is invalid', async () => {
      payload.eth_address = 'asdlkfjalsdkfj'
      await api.post(testEndpoint).send(payload).expect(400, {
        status: 400,
        message: 'Failed to validate request',
        code: 'InvalidFormData',
      })
    })

    test('when signature is missing', async () => {
      const missing: Record<string, string> = { ...payload }
      delete missing.eth_address_signature
      await api.post(testEndpoint).send(missing).expect(400, {
        status: 400,
        message: 'Failed to deserialize the JSON body into the target type',
        code: 'InvalidFormData',
      })
    })

    test('when signed by the wrong wallet', async () => {
      payload.eth_address_signature = await registerSignature(
        USER3_PRIVATE_KEY,
        payload.eth_address,
      )

      await api.post(testEndpoint).send(payload).expect(400, {
        status: 400,
        message: 'Failed to verify signature',
        code: 'InvalidSignature',
      })
    })

    test('returns 400 code when email already exists', async () => {
      // Try to create a user with the same email as a user from fixtures
      payload = {
        email: 'user2@crowdtrust.app',
        password: '12345678',
        eth_address: TEST_ADDRESS2,
        eth_address_signature: await registerSignature(TEST_PRIVATE_KEY2, TEST_ADDRESS2),
      }
      await api.post(testEndpoint).send(payload).expect({
        code: 'UserExists',
        message: 'User with email or eth_address already exists',
        status: 400,
      })
    })

    test('returns 400 code when email already exists', () => {
      // Try to create a user with the same email as a user from fixtures
      payload.email = 'admin1@crowdtrust.app'
      return api.post(testEndpoint).send(payload).expect({
        code: 'UserExists',
        message: 'User with email or eth_address already exists',
        status: 400,
      })
    })

    test('returns 400 when eth_address is already in use', () => {
      payload.eth_address = '0x0000000000000000000000000000000000000000'
      return api.post(testEndpoint).send(payload).expect(400, {
        code: 'UserExists',
        message: 'User with email or eth_address already exists',
        status: 400,
      })
    })
  })
})
