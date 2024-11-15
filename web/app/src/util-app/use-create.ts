import { apiCreateProject } from '@app/api'
import { ICreateProjectApiRequest } from '@app/types'
import { ref } from 'vue'
import { ts } from '../i18n'

export const useCreate = () => {
  const error = ref()
  const creating = ref(false)

  const createProject = async (payload: ICreateProjectApiRequest) => {
    creating.value = true
    try {
      await apiCreateProject(payload)
    } catch (e) {
      console.log('Create error:', e)
      error.value = ts('errors.Unknown')
    }
    creating.value = false
  }

  return {
    error,
    creating,
    createProject,
  }
}
