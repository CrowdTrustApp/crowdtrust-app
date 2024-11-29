import {
  IBackProjectApiRequest,
  IBackProjectApiResponse,
  IGetProjectApiResponse,
} from '@app/types'
import { commonRegex } from '@app/util'
import {
  adminAuthHeader,
  AppDbResetService,
  testagent,
  TestAgent,
  userAuthHeader,
} from '../helpers'
import { testConfig } from '../test.config'
import { describe, expect, test, beforeAll, beforeEach } from 'vitest'

describe('Back Project', () => {
  const testEndpoint = '/api/projects'
  const backEndpoint = (id: string) => `${testEndpoint}/${id}/actions/back`
  let api: TestAgent
  let testHelperApiUrl: string
  let dbResetService: AppDbResetService
  let payload: IBackProjectApiRequest
  let adminAuth: string
  let userAuth: string
  let userId: string
  let projectId: string

  beforeAll(() => {
    api = testagent(testConfig.get('apiUrl'))
    testHelperApiUrl = testConfig.get('apiTestHelperUrl')
    dbResetService = new AppDbResetService(testHelperApiUrl)
    adminAuth = adminAuthHeader()
  })

  beforeEach(async () => {
    await dbResetService.resetDb()
    userId = '45013993-2a1a-4ee5-8dbd-b4b63d9af34f'
    userAuth = userAuthHeader(userId)
    projectId = '3e42e273-546d-4989-a97c-f6eb173e8450'
    payload = {
      rewards: [{ reward_id: '8fe4b678-e9ac-4e1d-b37a-1254ec33656f', quantity: 1 }],
    }
  })

  const getProject = async (): Promise<IGetProjectApiResponse> => {
    const response = await api
      .get(`${testEndpoint}/${projectId}`)
      .set('Authorization', adminAuth)
      .expect(200)

    const body: IGetProjectApiResponse = response.body
    return body
  }

  test('user backs project with single reward', async () => {
    const response = await api
      .post(backEndpoint(projectId))
      .set('Authorization', userAuth)
      .send(payload)
      .expect(201)
    const body: IBackProjectApiResponse = response.body

    expect(body.id).toMatch(new RegExp(commonRegex.uuid))
    expect(body.comment).toEqual('')
    expect(body.project_id).toEqual(projectId)
    expect(body.user_id).toEqual(userId)

    // Project stats update
    const project = await getProject()
    expect(project.backer_count).toEqual(2)
    expect(project.total_pledged).toEqual('200000000000000000')

    // Reward stats update
    const reward = project.rewards.find((r) => r.id === payload.rewards[0]?.reward_id)
    expect(reward?.backer_count).toEqual(2)
  })

  test('user backs project with multiple rewards', async () => {
    payload.rewards = [
      { reward_id: '8fe4b678-e9ac-4e1d-b37a-1254ec33656f', quantity: 1 },
      { reward_id: 'b63ae027-4c66-496d-87ff-cf610a161309', quantity: 2 },
    ]
    const response = await api
      .post(backEndpoint(projectId))
      .set('Authorization', userAuth)
      .send(payload)
      .expect(201)
    const body: IBackProjectApiResponse = response.body

    expect(body.id).toMatch(new RegExp(commonRegex.uuid))
    expect(body.comment).toEqual('')
    expect(body.project_id).toEqual(projectId)
    expect(body.user_id).toEqual(userId)

    const project = await getProject()
    expect(project.backer_count).toEqual(2)
    expect(project.total_pledged).toEqual('500000000000000000')

    // Reward stats update
    const reward1 = project.rewards.find((r) => r.id === payload.rewards[0]?.reward_id)
    expect(reward1?.backer_count).toEqual(2)
    const reward2 = project.rewards.find((r) => r.id === payload.rewards[1]?.reward_id)
    expect(reward2?.backer_count).toEqual(2)
  })

  describe('when request is not valid', () => {
    test('when quantity is invalid', async () => {
      payload.rewards[0].quantity = 0
      await api
        .post(backEndpoint(projectId))
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          status: 400,
          message: 'Failed to validate request',
          code: 'InvalidFormData',
        })

      payload.rewards[0].quantity = 999999999999
      await api
        .post(backEndpoint(projectId))
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          status: 400,
          message: 'Failed to deserialize the JSON body into the target type',
          code: 'InvalidFormData',
        })
    })

    test('when reward ID is invalid', () => {
      payload.rewards[0].reward_id = '1234'

      return api
        .post(backEndpoint(projectId))
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          status: 400,
          message: 'Failed to validate request',
          code: 'InvalidFormData',
        })
    })

    test('when reward does not exist', () => {
      payload.rewards[0].reward_id = 'cbd7a9ff-18f5-489e-b61e-cdd4a1394968'

      return api
        .post(backEndpoint(projectId))
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          status: 400,
          message: 'Failed to validate request',
          code: 'UnknownReward',
        })
    })

    test('when project does not exist', async () => {
      projectId = 'cbd7a9ff-18f5-489e-b61e-cdd4a1394968'
      await api
        .post(backEndpoint(projectId))
        .set('Authorization', userAuth)
        .send(payload)
        .expect(404, {
          status: 404,
          message: 'Project not found',
          code: 'None',
        })
    })

    test('returns 401 when user is not authorized', async () => {
      await api.post(testEndpoint).expect(401, {
        code: 'Unauthorized',
        message: 'Unauthorized',
        status: 401,
      })
    })
  })
})
