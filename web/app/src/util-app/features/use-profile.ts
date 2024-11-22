import { IProjectViewModel, SortDirection } from '@app/types'
import { apiListProjects } from '@app/api'
import { ref } from 'vue'
import { store } from '@app/store'

const createdProjects = ref<IProjectViewModel[] | undefined>()

export const useProfile = () => {
  const loading = ref(false)

  const loadProjects = async () => {
    loading.value = true
    try {
      const res = await apiListProjects({
        user_id: store.user.id.value,
        column: 'created_at',
        direction: SortDirection.Desc,
      })
      createdProjects.value = res.results
    } catch (e) {
      console.log('Load project error:', e)
    }
    loading.value = false
  }

  return {
    createdProjects,
    loading,
    loadProjects,
  }
}
