import {
  IListUsersApiRequest,
  IListUsersApiResponse,
  IRegisterUserApiRequest,
  UserStatus,
  UserType,
} from '@app/types'
import {
  testagent,
  TestAgent,
  adminAuthHeader,
  userAuthHeader,
  TEST_ADDRESS1,
  registerSignature,
  TEST_PRIVATE_KEY1,
} from '../helpers'
import { testConfig } from '../test.config'
import { AppDbResetService } from '../helpers'
import { describe, expect, test, beforeAll, beforeEach } from 'vitest'

describe('List Users', () => {
  const testEndpoint = '/api/users'
  let api: TestAgent
  let testHelperApiUrl: string
  let dbResetService: AppDbResetService
  let payload: IRegisterUserApiRequest
  let query: IListUsersApiRequest
  let adminAuth: string

  beforeAll(() => {
    api = testagent(testConfig.get('apiUrl'))
    testHelperApiUrl = testConfig.get('apiTestHelperUrl')
    dbResetService = new AppDbResetService(testHelperApiUrl)
  })

  beforeEach(async () => {
    await dbResetService.resetDb()
    adminAuth = adminAuthHeader()
  })

  test('return 200 status code and users data', async () => {
    const response = await api
      .get(testEndpoint)
      .set('Authorization', adminAuth)
      .expect(200)
    const body: IListUsersApiResponse = response.body

    expect(body.total).toEqual(4)
    expect(body.results.length).toEqual(4)
  })

  test('returns 200 status and users when filtering from 1 to 2', async () => {
    query = { from: 1, to: 2 }

    const response = await api
      .get(testEndpoint)
      .query(query)
      .set('Authorization', adminAuth)
      .expect(200)

    const body: IListUsersApiResponse = response.body
    const users = body.results

    expect(body.total).toEqual(4)
    expect(users.length).toEqual(2)

    expect(users[0].id).toEqual('f481a6d5-ad06-4c3e-b3a5-4af0be50bb29')
    expect(users[0].email).toEqual('admin1@crowdtrust.app')
    expect(users[0].eth_address).toEqual('0xbc79345f5d78d2fd2ba5c2d3b3579c7548234ae5')
    expect(users[0].user_type).toEqual(UserType.Admin)
    expect(users[0].user_status).toEqual(UserStatus.Active)
    expect(users[0].email_confirmed).toEqual(true)

    expect(users[1].id).toEqual('45013993-2a1a-4ee5-8dbd-b4b63d9af34f')
    expect(users[1].email).toEqual('user1@crowdtrust.app')
    expect(users[1].user_type).toEqual(UserType.User)
    expect(users[1].user_status).toEqual(UserStatus.Active)
    expect(users[1].email_confirmed).toEqual(true)
  })

  test('filters by user type', async () => {
    query = { type: UserType.User }

    const response = await api
      .get(testEndpoint)
      .query(query)
      .set('Authorization', adminAuth)
      .expect(200)

    const body: IListUsersApiResponse = response.body

    expect(body.total).toEqual(3)
    expect(body.results[0].email).toEqual('user1@crowdtrust.app')
    expect(body.results[1].email).toEqual('user2@crowdtrust.app')
    expect(body.results[2].email).toEqual('user3@crowdtrust.app')
  })

  test('filters by user status', async () => {
    query = { status: UserStatus.Blocked }

    const response = await api
      .get(testEndpoint)
      .query(query)
      .set('Authorization', adminAuth)
      .expect(200)

    const body: IListUsersApiResponse = response.body

    expect(body.total).toEqual(1)
    expect(body.results[0].email).toEqual('user2@crowdtrust.app')
  })

  test('filters by user status and type', async () => {
    query = { type: UserType.User, status: UserStatus.Active }

    const response = await api
      .get(testEndpoint)
      .query(query)
      .set('Authorization', adminAuth)
      .expect(200)

    const body: IListUsersApiResponse = response.body

    expect(body.total).toEqual(2)
    expect(body.results[0].email).toEqual('user1@crowdtrust.app')
    expect(body.results[1].email).toEqual('user3@crowdtrust.app')
  })

  test('adds a user to the list', async () => {
    const response = await api.get(`/api/users`).set('Authorization', adminAuth)
    const body: IListUsersApiResponse = response.body
    const beforeCount = body.total

    payload = {
      email: 'test@test.com',
      password: '12345678',
      eth_address: TEST_ADDRESS1,
      eth_address_signature: await registerSignature(TEST_PRIVATE_KEY1, TEST_ADDRESS1),
    }
    await api.post('/api/users/registrations').send(payload).expect(201)

    const response2 = await api
      .get(`/api/users`)
      .set('Authorization', adminAuth)
      .expect(200)
    const body2: IListUsersApiResponse = response2.body

    expect(beforeCount + 1).toEqual(body2.total)
  })

  test('returns 401 error when user is not authorized', async () => {
    await api.get(testEndpoint).expect(401, {
      code: 'Unauthorized',
      message: 'Unauthorized',
      status: 401,
    })
  })

  test('returns 403 error when user type is user', async () => {
    const userAuth = userAuthHeader('45013993-2a1a-4ee5-8dbd-b4b63d9af34f')

    await api.get(testEndpoint).set('Authorization', userAuth).expect(403, {
      code: 'None',
      message: 'Forbidden',
      status: 403,
    })
  })
})
