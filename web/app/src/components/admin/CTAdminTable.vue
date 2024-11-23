<template>
  <div class="ct-admin-table-wrap" :class="{ 'ct-admin-table-wrap--empty': !haveData }">
    <table class="ct-admin-table" :class="{ 'ct-admin-table--no-nav': !showNav }">
      <thead>
        <tr>
          <th
            v-for="(col, index) in columns"
            :key="index"
            class="ct-admin-table-th"
            :style="{ width: col.width || 'auto' }"
            @click="col.sortable ? doSort(col.field) : false"
          >
            <div class="ct-admin-table-th-content">
              <span class="ct-admin-table-th-label">
                {{ col.label }}
              </span>
              <div v-if="col.sortable" class="ct-admin-table-th-order">
                <Caret
                  class="order-up order"
                  :class="{ active: order === col.field && sort === 'asc' }"
                />
                <Caret
                  class="order-down order"
                  :class="{ active: order === col.field && sort === 'desc' }"
                />
              </div>
            </div>
          </th>
          <th v-if="rowActions" class="ct-admin-table-th ct-admin-table-th--actions" />
        </tr>
      </thead>
      <tbody v-if="haveData">
        <template v-for="(row, rowIndex) in rows" :key="rowIndex">
          <tr
            class="ct-admin-table-tr"
            :class="rowClass?.(row)"
            @click="emit('rowClicked', row)"
          >
            <td
              v-for="(col, colIndex) in columns"
              :key="colIndex"
              class="ct-admin-table-td"
              :class="col.field"
            >
              <div v-if="col.display" v-html="col.display(row)"></div>
              <span v-else-if="col.field">
                {{ row[col.field] }}
              </span>
              <Caret
                v-if="col.slot === 'collapse-cell'"
                class="collapse-cell-toggle"
                :class="{ 'collapse-cell-toggle--on': row.toggled }"
              />
              <slot v-else :name="col.slot" :col="col" :row="row" :index="rowIndex" />
            </td>
            <td v-if="rowActions" class="ct-admin-table-td ct-admin-table-td--actions">
              <CTMenu
                :items="rowActions(row, rowIndex)"
                :hideWhenNoItems="true"
                @click.stop="$event.preventDefault()"
              >
                <template #toggle>
                  <DotsIcon />
                </template>
              </CTMenu>
            </td>
          </tr>
          <slot name="after-row" :row="row" />
        </template>
      </tbody>
    </table>
    <Spinner
      v-if="loading"
      :size="40"
      class="ct-admin-table-spinner"
      color="rgb(1, 98, 162)"
    />
    <div v-else-if="!haveData" class="ct-admin-table-no-data">No Data</div>
    <TableNav
      v-if="!loading && showNav && haveData"
      :page="page"
      :maxPage="maxPage"
      :pageSize="pageSize"
      :offset="offset"
      :total="total"
      @setPage="emit('update:page', $event)"
      @setPageSize="emit('update:pageSize', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onBeforeUpdate, toRefs } from 'vue'
import {
  AdminTablePageSize,
  Column,
  IAdminTableItem,
  IDropdownMenuItem,
  ITableSort,
} from '@app/types'
import Spinner from '../widgets/Spinner.vue'
import CTMenu from '../widgets/CTMenu.vue'
import Caret from '../svg/Caret.vue'
import DotsIcon from '../svg/DotsIcon.vue'
import TableNav from './TableNav.vue'

const emit = defineEmits<{
  (e: 'rows-checked', data: Array<string>): void
  (
    e: 'search',
    offset: number,
    limit: number,
    newOrder: string | undefined,
    newSort: string,
  ): void
  (e: 'update:pageSize', size: AdminTablePageSize): void
  (e: 'update:page', value: number): void
  (e: 'rowClicked', row: IAdminTableItem): void
}>()
const props = withDefaults(
  defineProps<{
    showNav?: boolean
    hasCheckbox?: boolean
    columns?: Column[]
    rows?: IAdminTableItem[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rowActions?: (row: any, index: number) => IDropdownMenuItem[]
    pageSize?: AdminTablePageSize
    loading?: boolean
    // Total number of items/rows
    total?: number
    // Current page number
    page?: number
    // Sort condition
    sortable?: ITableSort
    rowClass?: (row: IAdminTableItem) => string
  }>(),
  {
    showNav: true,
    hasCheckbox: false,
    columns: () => [],
    rows: () => [],
    rowActions: undefined,
    pageSize: 50,
    total: 100,
    page: 1,
    sortable: () => ({
      order: 'id',
      sort: 'asc',
    }),
    rowClass: undefined,
  },
)
const { rows, pageSize, page, total, columns, hasCheckbox, sortable } = toRefs(props)

const maxPage = computed(() => {
  if (total.value <= 0) {
    return 0
  }
  const max = Math.floor(total.value / pageSize.value)
  const mod = total.value % pageSize.value
  if (mod > 0) {
    return max + 1
  }
  return max
})

// Initial page number
const offset = computed(() => {
  return (page.value - 1) * pageSize.value + 1
})

const haveData = computed(() => {
  return rows.value ? !!rows.value.length : false
})

const allChecked = ref(false)

const order = ref(sortable.value.order)
const sort = ref(sortable.value.sort)

////////////////////////////
//
//  Checkbox related operations
//
const rowCheckbox = ref<HTMLInputElement[]>([])

if (hasCheckbox.value) {
  onBeforeUpdate(() => {
    // Clear all values before each update
    rowCheckbox.value = []
  })
  watch(allChecked, (state: boolean) => {
    const isChecked: Array<string> = []
    rowCheckbox.value.forEach((val: HTMLInputElement) => {
      if (val) {
        val.checked = state
        if (val.checked) {
          isChecked.push(val.value)
        }
      }
    })
    // Return the selected data
    emit('rows-checked', isChecked)
  })
}

const clearChecked = () => {
  rowCheckbox.value.forEach((val: HTMLInputElement) => {
    if (val && val.checked) {
      val.checked = false
    }
  })
  emit('rows-checked', [])
}

////////////////////////////
//
//  Sorting, page change, etc.
//
const doSort = (newOrder: string | undefined) => {
  let newSort = 'asc'
  if (newOrder == order.value) {
    if (sort.value == 'asc') {
      newSort = 'desc'
    }
  }
  const limit = pageSize.value
  order.value = newOrder
  sort.value = newSort
  emit('search', offset.value, limit, newOrder, newSort)
  if (allChecked.value) {
    allChecked.value = false
  } else {
    if (hasCheckbox.value) {
      clearChecked()
    }
  }
}

const changePage = (page: number, _prevPage: number) => {
  allChecked.value = false
  const offset = (page - 1) * pageSize.value
  const limit = pageSize.value
  emit('search', offset, limit, order.value, sort.value)
}
watch(() => page.value, changePage)

const changePageSize = () => {
  if (page.value === 1) {
    changePage(page.value, page.value)
  } else {
    page.value = 1
    allChecked.value = false
  }
}
watch(pageSize, changePageSize)
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.ct-admin-table-wrap {
  display: table;
  width: 100%;
  margin-top: 24px;
  border: 1px solid $border1;
  &--empty {
    border: none;
  }
}
.ct-admin-table {
  width: 100%;
  height: 100%;
  border-spacing: 0;
  color: $text1;
  .ct-admin-table-th {
    padding: 12px;
    white-space: nowrap;
    background-color: $text3;
    color: $primary;
    &--actions {
      width: 40%;
    }
    &:first-of-type {
      padding-left: 24px;
    }
  }
  .ct-admin-table-th-content {
    @mixin semibold 14px;
    display: flex;
    flex-direction: row;
    align-items: center;
    text-transform: uppercase;
    .ct-admin-table-th-order {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      margin-left: 8px;
      .order-up {
        transform: rotate(180deg);
      }
      svg {
        width: 9px;
        line {
          stroke: $primary;
        }
      }
      .order.active line {
        stroke: $blue2;
      }
    }
  }
  .ct-admin-table-td {
    @mixin text 13px;
    padding: 12px;
    border-top: 1px solid $border1;
    background-color: white;
    &--actions {
      width: 10%;
      text-align: right;
    }
    :deep(.dropdown-menu-items-wrap) {
      right: 24px;
      top: 40px;
    }
    &:first-of-type {
      padding-left: 20px;
      padding-right: 16px;
    }
  }
}
.collapse-cell-toggle {
  transition: transform 0.3s;
  &--on {
    transform: rotate(90deg);
  }
}
.ct-admin-table-spinner {
  padding: 48px 0;
  display: flex;
  justify-content: center;
}
.ct-admin-table-no-data {
  @mixin semibold 18px;
  padding: 72px 0;
  color: $disabled1;
  text-align: center;
}
</style>
