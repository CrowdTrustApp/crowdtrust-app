import { AppDbResetService, testagent, TestAgent } from '../helpers'
import { IUserExistsApiRequest } from '@app/types'
import { testConfig } from '../test.config'
import { beforeAll, beforeEach, describe, test } from 'vitest'

describe('User Exists query endpoint', () => {
  let api: TestAgent
  let testHelperApiUrl: string
  let dbResetService: AppDbResetService
  let testEndpoint: string
  let query: IUserExistsApiRequest

  beforeAll(async () => {
    api = testagent(testConfig.get('apiUrl'))
    testHelperApiUrl = testConfig.get('apiTestHelperUrl')
    dbResetService = new AppDbResetService(testHelperApiUrl)
    await dbResetService.resetDb()
  })

  beforeEach(() => {
    testEndpoint = '/api/users/queries/exists'
    query = { eth_address: '0x886ffe3d8b8851ecdf48888d9c630afd95c85fd1' }
  })

  describe('when request is valid', () => {
    test('returns true if user exists', () => {
      return api.get(testEndpoint).query(query).expect({ exists: true })
    })

    test('returns false if user does not exist', () => {
      query = { eth_address: '0xFFFF000000000000000000000000000000000001' }
      return api.get(testEndpoint).query(query).expect({ exists: false })
    })
  })

  describe('when request is not valid returns error', () => {
    test('when eth address is missing', async () => {
      await api.get(testEndpoint).expect(400)
    })

    test('when eth address is invalid', () => {
      query = { eth_address: 'abcdefghifklmnop' }
      return api.get(testEndpoint).query(query).expect(400, {
        status: 400,
        message: 'Failed to validate request',
        code: 'InvalidFormData',
      })
    })
  })
})
