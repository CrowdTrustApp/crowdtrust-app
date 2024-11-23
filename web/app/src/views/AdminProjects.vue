<template>
  <div class="admin-projects">
    <CTAdminTable
      :columns="columns"
      :rows="projects"
      :rowActions="rowActions"
      :total="projectsData.total"
      :page="projectsData.page"
      :pageSize="projectsData.pageSize"
      :actions="actions"
      :loading="loading"
      @update:page="adminProjectsUpdatePage"
      @update:pageSize="adminProjectsUpdatePageSize"
    >
      <template #status="{ row }">
        <CTMultiselect
          :value="row.status"
          :placeholder="ts('status')"
          :options="statuses"
          @select="setStatus(row, $event?.value)"
        />
      </template>
    </CTAdminTable>
  </div>
</template>

<script lang="ts" setup>
import {
  AdminTablePageSize,
  Column,
  IAdminTableAction,
  IAdminTableActionEvent,
  IDropdownMenuItem,
  IListProjectsApiRequest,
  IProjectViewModel,
  ProjectStatus,
} from '@app/types'
import CTAdminTable from '../components/admin/CTAdminTable.vue'
import { ts } from '../i18n'
import { useRoute } from 'vue-router'
import { computed, onMounted, ref, Ref } from 'vue'
import { apiListProjects, apiUpdateProject } from '@app/api'
import CTMultiselect from '../components/widgets/CTMultiselect.vue'

interface IAdminProjectRecord extends IProjectViewModel {
  updating: boolean
}

interface IAdminProjectsTableData {
  total: number
  page: number
  pageSize: AdminTablePageSize
}

const statuses = Object.entries(ProjectStatus).map(([value, label]) => ({
  label,
  value,
}))

const projectsData: Ref<IAdminProjectsTableData> = ref({
  total: 0,
  page: 1,
  pageSize: 25,
})
const route = useRoute()
const projects: Ref<IProjectViewModel[]> = ref([])
const userId = computed(() => route?.query.userId as string | undefined)
const loading = ref(false)

const columns: Column<IAdminProjectRecord>[] = [
  {
    label: ts('id'),
    field: 'id',
    width: '30%',
  },
  {
    label: ts('name'),
    field: 'name',
    width: '20%',
  },
  {
    label: ts('status'),
    width: '10%',
    slot: 'status',
  },
  {
    label: ts('created'),
    field: 'created_at',
    width: '10%',
    display: (item) => item.created_at.toLocaleDateString(),
  },
]

const actions = {
  getAll: (row: IAdminProjectRecord): Record<string, IAdminTableAction> => ({
    view: () => ({
      label: ts('view'),
      class: 'view-site-action',
      to: { name: 'Project', params: { id: row.id } },
      linkTarget: '__blank',
    }),
    migrateServer: (click?: IAdminTableActionEvent) => ({
      label: ts('site.migrate'),
      class: 'migrate-server',
      click,
    }),
    changeOwner: (click?: IAdminTableActionEvent) => ({
      label: ts('site.change'),
      class: 'change-owner',
      click,
    }),
  }),
}

const rowActions = (row: IAdminProjectRecord): IDropdownMenuItem[] => {
  const allActions = actions.getAll(row)

  return [allActions.view()]
}

const setStatus = async (row: IAdminProjectRecord, newStatus: string | undefined) => {
  if (newStatus) {
    const status = newStatus as ProjectStatus
    await apiUpdateProject(row.id, { status })
    row.status = status
  }
}

const adminGetProjects = async (): Promise<void> => {
  const offset = (projectsData.value.page - 1) * projectsData.value.pageSize
  const from = offset + 1
  const to = offset + projectsData.value.pageSize
  // const sort = form.sort.input as ISortOption | undefined
  const query: IListProjectsApiRequest = {
    // type: (form.type.input as unknown as ProjectType) || undefined,
    // published: (form.published.input as unknown as boolean) ?? undefined,
    user_id: userId.value,
    from,
    to,
    // column: sort?.column,
    // direction: sort?.direction,
  }
  loading.value = true
  projects.value = []
  try {
    const projectsResponse = await apiListProjects(query)
    projects.value = projectsResponse.results
  } catch (_e) {
    //
  }
  loading.value = false
}

const projectsDataUpdateFn = (data: Partial<IAdminProjectsTableData>) => {
  Object.assign(projectsData.value, data)
}

const adminProjectsUpdatePageSize = (size: AdminTablePageSize) => {
  projectsDataUpdateFn({
    page: 1,
    pageSize: size,
  })
  adminGetProjects()
}

const adminProjectsUpdatePage = (page: number) => {
  projectsDataUpdateFn({ page })
  adminGetProjects()
}

onMounted(() => {
  adminGetProjects()
})
</script>

<style lang="postcss" scoped>
.admin-projects {
  max-width: 940px;
  margin: 0 auto;
  min-height: 400px;
  padding-bottom: 80px;
}
</style>
