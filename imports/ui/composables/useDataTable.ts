import { ref, toRefs, computed, watch, useAttrs } from 'vue'
import { merge, kebabCase } from 'lodash'

// Types
import { Props, Emit, ActionCol } from '../types/data-table'
type DataTableProps = { [K in keyof Required<Props>]: Required<Props>[K] }

const useDataTable = ({
  props,
  emit,
}: {
  props: DataTableProps
  emit: Emit
}) => {
  const { layout, actionCol, currentPage, pageSize, paginationProps } =
    toRefs(props)

  const $attrs = useAttrs()

  const innerCurrentPage = ref(1)
  const innerPageSize = ref(1)
  const sortData = ref<DataTableProps['tableProps']['defaultSort']>(
    props.tableProps?.defaultSort
  )

  const actionColProp = ref('e6e4c9de-7cf5-4f19-bb73-838e5182a372')
  const innerPaginationProps = ref<Props['paginationProps']>({})

  // Computed
  const attrs = computed(() => {
    const props: Record<string, any> = {}
    const listeners: Record<string, any> = {}

    const onRE = /^on[^a-z]/

    for (const property in $attrs) {
      // Filter listener from attribute
      if (onRE.test(property)) {
        // Get event listener name by remove word "on" from property
        const eventName = kebabCase(property.substring(2))
        listeners[eventName] = $attrs[property]
      } else if (property != 'class' && property != 'style') {
        props[property] = $attrs[property]
      }
    }

    const { onPrevClick, onNextClick, onCurrentPageChange } = $attrs as {
      onPrevClick?: ((val: number) => void) | undefined
      onNextClick?: ((val: number) => void) | undefined
      onCurrentPageChange?: ((val: number) => void) | undefined
    }
    const paginate: {
      onPrevClick?: ((val: number) => void) | undefined
      onNextClick?: ((val: number) => void) | undefined
      onCurrentPageChange?: ((val: number) => void) | undefined
    } = { onPrevClick, onNextClick, onCurrentPageChange }

    return { props, listeners, paginate }
  })

  const layouts = computed(() => {
    return layout.value.split(',').map((item) => item.trim())
  })
  const innerTableProps = computed(() => {
    const loadingProps = [
      'elementLoadingText',
      'elementLoadingSpinner',
      'elementLoadingBackground',
    ] as const

    const tableProps: DataTableProps['tableProps'] & {
      elementLoadingText?: string
      elementLoadingSpinner?: string
      elementLoadingBackground?: string
    } = Object.assign(
      {
        fit: true,
        size: 'small',
        ...attrs.value.props,
      },
      {
        ...props.tableProps,
        maxHeight: props.tableProps?.height,
        height: '100%',
      }
    )

    loadingProps.forEach((prop) => {
      if (tableProps[prop]) {
        tableProps[kebabCase(prop) as typeof prop] = tableProps[prop]
        delete tableProps[prop]
      }
    })
    return tableProps
  })
  const innerActionCol = computed<ActionCol>(() => {
    return merge(
      {
        buttons: [],
        props: {
          label: 'Operate',
        },
      },
      actionCol.value || {}
    )
  })
  const paginationShow = computed<boolean>(() => {
    return layouts.value.includes('pagination')
  })
  const actionColShow = computed<boolean>(() => {
    return innerActionCol.value.buttons.length > 0
  })

  // Watch
  watch(
    pageSize,
    (val) => {
      innerPageSize.value = val
    },
    { immediate: true }
  )
  watch(innerPageSize, (val) => {
    emit('update:pageSize', val)
  })
  watch(
    currentPage,
    (val) => {
      innerCurrentPage.value = val
    },
    {
      immediate: true,
    }
  )
  watch(innerCurrentPage, (val) => {
    emit('update:currentPage', val)
  })
  watch(
    paginationProps,
    (val) => {
      if (paginationShow.value) {
        innerPaginationProps.value = Object.assign(
          {
            pageSizes: [20, 50, 100],
            layout: 'prev, pager, next, jumper, sizes, total',
          },
          val
        )

        if (
          innerPaginationProps.value.pageSizes?.indexOf(innerPageSize.value) ===
          -1
        ) {
          console.warn(
            `pageSize ${innerPageSize.value} is not included in pageSizes[${innerPaginationProps.value.pageSizes}], set pageSize to pageSizes[0]: ${innerPaginationProps.value.pageSizes[0]}`
          )
          innerPageSize.value = innerPaginationProps.value.pageSizes[0]
        }
      }
    },
    {
      immediate: true,
    }
  )

  // Methods
  const clickActionButton = (
    button: ActionCol['buttons'][0],
    args: Parameters<ActionCol['buttons'][0]['handler']>
  ) => {
    button.handler(...args)
  }

  return {
    innerCurrentPage,
    innerPageSize,
    sortData,
    actionColProp,
    attrs,
    innerTableProps,
    innerActionCol,
    paginationShow,
    actionColShow,
    clickActionButton,
  }
}

export { useDataTable }
