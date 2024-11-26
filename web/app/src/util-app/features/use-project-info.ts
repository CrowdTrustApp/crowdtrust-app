import { apiCreateProject, apiUpdateProject } from '@app/api'
import {
  ICreateProjectApiRequest,
  IProjectViewModel,
  IUpdateProjectApiRequest,
  IUpdateProjectFeature,
  ProjectStatus,
} from '@app/types'
import { ref } from 'vue'
import { addDays } from 'date-fns'
import { useInputLimit } from '../use-input-limit'
import { ts } from '../../i18n'

export const useProjectInfoFields = (project?: IProjectViewModel) => {
  const name = useInputLimit({ min: 3, max: 50, label: 'Name', initial: project?.name })
  const blurb = useInputLimit({
    min: 5,
    max: 120,
    label: 'Blurb',
    initial: project?.blurb,
  })
  const description = useInputLimit({
    min: 10,
    max: 10000,
    label: 'Description',
    initial: project?.description,
  })
  const category = ref(project?.category)
  const start = project ? new Date(project.start_time * 1000) : undefined
  const startTime = ref<Date | undefined>(start ?? addDays(new Date(), 10))
  const initialDuration = project ? project.duration / (24 * 60 * 60) : undefined
  const duration = ref(initialDuration?.toString() ?? '10')
  const initialGoal = project ? parseFloat(project.funding_goal) / 1e18 : undefined
  const goal = ref(initialGoal?.toString() ?? '5')

  return {
    name,
    blurb,
    description,
    category,
    startTime,
    duration,
    goal,
  }
}

export const useProjectInfo = (project?: IProjectViewModel): IUpdateProjectFeature => {
  const error = ref()
  const submitting = ref(false)
  const fields = useProjectInfoFields(project)

  const isActive = (): boolean => {
    const status = project?.status
    if (!status) {
      return false
    }
    return [ProjectStatus.Active, ProjectStatus.Complete, ProjectStatus.Denied].includes(
      status,
    )
  }

  const addChangedField = (
    request: IUpdateProjectApiRequest,
    field: string,
    value: unknown,
  ): boolean => {
    if (project) {
      const proj = project as any
      if (proj[field] !== value) {
        const req = request as any
        req[field] = value
      }
    }
    return true
  }

  const updateProjectFields = (request: IUpdateProjectApiRequest) => {
    if (project) {
      for (const [field, value] of Object.entries(request)) {
        const proj = project as any
        proj[field] = value
      }
    }
  }

  const submitUpdate = async (id: string, payload: IUpdateProjectApiRequest) => {
    submitting.value = true
    try {
      await apiUpdateProject(id, payload)
    } catch (e) {
      console.log('Update error:', e)
      error.value = ts('errors.Unknown')
    }
    submitting.value = false
  }

  const submitCreate = async (
    payload: ICreateProjectApiRequest,
  ): Promise<string | undefined> => {
    submitting.value = true
    try {
      const res = await apiCreateProject(payload)
      return res.id
    } catch (e) {
      console.log('Create error:', e)
      error.value = ts('errors.Unknown')
    }
    submitting.value = false
  }

  return {
    error,
    submitting,
    ...fields,
    isActive,
    updateProjectFields,
    addChangedField,
    submitUpdate,
    submitCreate,
  }
}
