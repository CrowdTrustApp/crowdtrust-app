import { IListProjectsApiRequest, IListProjectsApiResponse } from '@app/types'
import { testagent, TestAgent, adminAuthHeader, userAuthHeader } from '../helpers'
import { testConfig } from '../test.config'
import { AppDbResetService } from '../helpers'
import { describe, expect, test, beforeAll, beforeEach } from 'vitest'

const TotalProjects = 11

describe('List Projects', () => {
  const testEndpoint = '/api/projects'
  let api: TestAgent
  let testHelperApiUrl: string
  let dbResetService: AppDbResetService
  let query: IListProjectsApiRequest
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

  describe('when requester is Admin', () => {
    test('return 200 status code and projects with default sorting', async () => {
      const response = await api
        .get(testEndpoint)
        .set('Authorization', adminAuth)
        .expect(200)
      const body: IListProjectsApiResponse = response.body

      expect(body.total).toEqual(TotalProjects)
      expect(body.results.length).toEqual(TotalProjects)
    })

    test('returns 200 status and sites when filtering from 1 to 2', async () => {
      query = { from: 1, to: 2 }

      const response = await api
        .get(testEndpoint)
        .query(query)
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IListProjectsApiResponse = response.body
      const users = body.results

      expect(body.total).toEqual(TotalProjects)
      expect(users.length).toEqual(2)

      expect(users[0].id).toEqual('14bfe82a-1003-446b-b6bb-20a176e848e0')
      expect(users[1].id).toEqual('a3a2b1c4-a1ee-42d5-a729-bb6ff6fdfdfe')
    })

    test('filters by one category', async () => {
      const response = await api
        .get(testEndpoint)
        .query('categories[]=Technology')
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IListProjectsApiResponse = response.body

      expect(body.total).toEqual(2)
      expect(body.results[0].id).toEqual('a3a2b1c4-a1ee-42d5-a729-bb6ff6fdfdfe')
      expect(body.results[1].id).toEqual('fa4d21c2-16a3-46cf-8162-98f4a82b59aa')
    })

    test('filters by one status', async () => {
      const response = await api
        .get(testEndpoint)
        .query('statuses[]=Active')
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IListProjectsApiResponse = response.body

      expect(body.total).toEqual(3)
      expect(body.results[0].id).toEqual('3e42e273-546d-4989-a97c-f6eb173e8450')
      expect(body.results[1].id).toEqual('9e8f0c6f-1edf-4d68-a096-7a2bb4625c98')
      expect(body.results[2].id).toEqual('00df0e23-22af-4959-874c-aca385b54eed')
    })

    test('filters by one status and category', async () => {
      const response = await api
        .get(testEndpoint)
        .query('categories[]=Music&statuses[]=Active')
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IListProjectsApiResponse = response.body

      expect(body.total).toEqual(1)
      expect(body.results[0].id).toEqual('3e42e273-546d-4989-a97c-f6eb173e8450')
    })

    test('filters by multiple status and category', async () => {
      const response = await api
        .get(testEndpoint)
        .query(
          'categories[]=Fashion&categories[]=Technology&statuses[]=Active&statuses[]=Review',
        )
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IListProjectsApiResponse = response.body

      expect(body.total).toEqual(1)
      expect(body.results[0].id).toEqual('a3a2b1c4-a1ee-42d5-a729-bb6ff6fdfdfe')
    })

    test('filters by user_id', async () => {
      query = { user_id: '45013993-2a1a-4ee5-8dbd-b4b63d9af34f' }
      const response = await api
        .get(testEndpoint)
        .query(query)
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IListProjectsApiResponse = response.body

      expect(body.total).toEqual(3)
      expect(body.results[0].id).toEqual('14bfe82a-1003-446b-b6bb-20a176e848e0')
      expect(body.results[1].id).toEqual('a3a2b1c4-a1ee-42d5-a729-bb6ff6fdfdfe')
      expect(body.results[2].id).toEqual('d13b990d-172e-4a01-aeea-43f6ef505a7c')
    })
  })

  describe('when requester is User', () => {
    let userAuth: string

    beforeEach(() => {
      userAuth = userAuthHeader('45013993-2a1a-4ee5-8dbd-b4b63d9af34f')
    })

    test('returns active and completed projects with default sorting', async () => {
      const response = await api
        .get(testEndpoint)
        .set('Authorization', userAuth)
        .expect(200)
      const body: IListProjectsApiResponse = response.body

      expect(body.total).toEqual(7)
      expect(body.results.length).toEqual(7)
      expect(body.results[0].id).toEqual('d13b990d-172e-4a01-aeea-43f6ef505a7c')
      expect(body.results[1].id).toEqual('0c9d3f3e-8027-4582-b573-99b2d6f87ebc')
      expect(body.results[2].id).toEqual('a9b3146a-1bb7-49fc-b4be-c25e103d899c')
      expect(body.results[3].id).toEqual('3e42e273-546d-4989-a97c-f6eb173e8450')
      expect(body.results[4].id).toEqual('9e8f0c6f-1edf-4d68-a096-7a2bb4625c98')
      expect(body.results[5].id).toEqual('fa4d21c2-16a3-46cf-8162-98f4a82b59aa')
      expect(body.results[6].id).toEqual('00df0e23-22af-4959-874c-aca385b54eed')
    })

    test('filters by own user_id', async () => {
      query = { user_id: '45013993-2a1a-4ee5-8dbd-b4b63d9af34f' }
      const response = await api
        .get(testEndpoint)
        .query(query)
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IListProjectsApiResponse = response.body

      expect(body.total).toEqual(3)
      expect(body.results[0].id).toEqual('14bfe82a-1003-446b-b6bb-20a176e848e0')
      expect(body.results[1].id).toEqual('a3a2b1c4-a1ee-42d5-a729-bb6ff6fdfdfe')
      expect(body.results[2].id).toEqual('d13b990d-172e-4a01-aeea-43f6ef505a7c')
    })

    test('filters by other user_id', async () => {
      query = { user_id: '00e8ee0b-843b-43e7-84c1-6d7a64cd5cfd' }
      const response = await api
        .get(testEndpoint)
        .query(query)
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IListProjectsApiResponse = response.body

      expect(body.total).toEqual(6)
      expect(body.results[0].id).toEqual('0c9d3f3e-8027-4582-b573-99b2d6f87ebc')
      expect(body.results[1].id).toEqual('a9b3146a-1bb7-49fc-b4be-c25e103d899c')
      expect(body.results[2].id).toEqual('3e42e273-546d-4989-a97c-f6eb173e8450')
      expect(body.results[3].id).toEqual('9e8f0c6f-1edf-4d68-a096-7a2bb4625c98')
      expect(body.results[4].id).toEqual('fa4d21c2-16a3-46cf-8162-98f4a82b59aa')
      expect(body.results[5].id).toEqual('00df0e23-22af-4959-874c-aca385b54eed')
    })
  })

  describe('when requester is Anonymous', () => {
    test('returns active and completed projects with default sorting', async () => {
      const response = await api.get(testEndpoint).expect(200)
      const body: IListProjectsApiResponse = response.body

      expect(body.total).toEqual(7)
      expect(body.results.length).toEqual(7)
      expect(body.results[0].id).toEqual('d13b990d-172e-4a01-aeea-43f6ef505a7c')
      expect(body.results[1].id).toEqual('0c9d3f3e-8027-4582-b573-99b2d6f87ebc')
      expect(body.results[2].id).toEqual('a9b3146a-1bb7-49fc-b4be-c25e103d899c')
      expect(body.results[3].id).toEqual('3e42e273-546d-4989-a97c-f6eb173e8450')
      expect(body.results[4].id).toEqual('9e8f0c6f-1edf-4d68-a096-7a2bb4625c98')
      expect(body.results[5].id).toEqual('fa4d21c2-16a3-46cf-8162-98f4a82b59aa')
      expect(body.results[6].id).toEqual('00df0e23-22af-4959-874c-aca385b54eed')
    })

    test('filters by user_id without active or completed products', async () => {
      query = { user_id: '45013993-2a1a-4ee5-8dbd-b4b63d9af34f' }
      const response = await api
        .get(testEndpoint)
        .query(query)
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IListProjectsApiResponse = response.body

      expect(body.total).toEqual(3)
      expect(body.results[0].id).toEqual('14bfe82a-1003-446b-b6bb-20a176e848e0')
      expect(body.results[1].id).toEqual('a3a2b1c4-a1ee-42d5-a729-bb6ff6fdfdfe')
      expect(body.results[2].id).toEqual('d13b990d-172e-4a01-aeea-43f6ef505a7c')
    })
  })
})
