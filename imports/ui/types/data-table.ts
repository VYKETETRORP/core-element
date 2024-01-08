import { ButtonProps, PaginationProps } from 'element-plus'
import type {
  TableProps,
  Sort as TableSort,
} from 'element-plus/es/components/table/src/table/defaults'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'

type Props<T = any> = {
  layout?: string
  data: T[]
  filters?: {
    prop: string[]
    value: string | number | Date | boolean
    filterFn?: (...params: any) => any
  }[]
  tableProps?: Partial<TableProps<T>>
  actionCol?: ActionCol<T>
  currentPage?: number
  pageSize?: number
  paginationProps?: Partial<PaginationProps>
  total?: number
  loading?: boolean
  sortMethod?: Record<string, any>
  filterProps?: string[]
}
type Emit = {
  (e: 'size-change', size: number): void
  (e: 'query-change', info: QueryInfo): void
  (e: 'update:pageSize', pageSize: number): void
  (e: 'update:currentPage', currentPage: number): void
  (e: 'next-click', currentPage: number): void
  (e: 'prev-click', currentPage: number): void
  (e: 'current-page-change', currentPage: number): void
  (e: 'filtered-data', value: any[]): void
}

type ActionCol<T = any> = {
  buttons: {
    label: string
    type?: ButtonProps['type']
    icon?: ButtonProps['icon']
    props?: Partial<ButtonProps>
    handler: (row: T, column: TableColumnCtx<T>, $index: string) => void
  }[]
  props?: Partial<TableColumnCtx<T>>
}
type QueryInfo = {
  type: 'init' | 'filter' | 'page' | 'sort' | 'size'
  page: number
  pageSize: number
  sort: TableSort
  filters: Filter[]
}
type Filter = {
  prop: string[]
  value: string | number | Date | boolean
  filterFn?: (...p: any) => any
}

export { Props, Emit, ActionCol, QueryInfo, TableSort, Filter }
