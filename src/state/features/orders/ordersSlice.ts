import {
  createAsyncThunk,
  createSlice,
  type PayloadAction
} from '@reduxjs/toolkit'
import { ServiceComments } from '../../../firebase/ServiceComments'
import { ServiceOrders } from '../../../firebase/ServiceOrders'
import { formatOrders, isUnsolvedOrder } from '../../../libs/orders'
import type { CommentType } from '../../../types/CommentType'
import type OrderType from '../../../types/OrderType'
import { order_type } from '../../../types/OrderType'
import { serializeObj } from '../../libs/serializeObj'

// Types
export type FetchTypeOrders =
  | 'all'
  | 'solved'
  | 'unsolved'
  | 'mine'
  | 'mineSolved'
  | 'mineUnsolved'

export interface OrdersState {
  // Entities - normalized data
  orders?: Partial<OrderType>[] | null
  orderIds: string[]

  // Filtered lists for performance
  unsolvedOrders: string[]
  solvedOrders: string[]
  myOrders: string[]
  rentOrders: string[]
  repairOrders: string[]
  saleOrders: string[]
  expiredOrders: string[]

  // Comments and reports
  reports: CommentType[]
  comments: Record<string, CommentType>

  // Loading states
  loading: boolean
  refreshing: boolean
  lastFetch: number | null

  // Error handling
  error: string | null

  // Filters and settings
  fetchType: FetchTypeOrders
  storeId: string | null
  sections: string[]
  getBySections: boolean

  // Performance optimization
  cacheExpiry: number // 5 minutes
  listeners: string[]
}

const initialState: OrdersState = {
  orders: undefined,
  orderIds: [],
  unsolvedOrders: [],
  solvedOrders: [],
  myOrders: [],
  rentOrders: [],
  repairOrders: [],
  saleOrders: [],
  expiredOrders: [],
  reports: [],
  comments: {},
  loading: true,
  refreshing: false,
  lastFetch: null,
  error: null,
  fetchType: 'mine',
  storeId: null,
  sections: [],
  getBySections: false,
  cacheExpiry: 5 * 60 * 1000, // 5 minutes
  listeners: []
}

// Async Thunks
export const fetchUnsolvedOrders = createAsyncThunk(
  'orders/fetchUnsolved',
  async (
    params: {
      storeId: string
      sections?: string[]
      getBySections?: boolean
      getExpireTomorrow?: boolean
      forceRefresh?: boolean
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { orders: OrdersState }
      const now = Date.now()

      // Check cache validity unless force refresh
      if (
        !params.forceRefresh &&
        state.orders.lastFetch &&
        now - state.orders.lastFetch < state.orders.cacheExpiry
      ) {
        return { orders: [], reports: [], cached: true }
      }

      // Fetch comments and reports first
      const reports = await ServiceComments.getUnsolvedImportantAndReports(
        params.storeId
      )

      // Fetch orders based on sections
      const orders = await ServiceOrders.getUnsolvedByStore(params.storeId, {
        getBySections: params.getBySections || false,
        sections: params.sections || [],
        reports,
        getExpireTomorrow: params.getExpireTomorrow || false
      })

      const formattedOrders = formatOrders({ orders, reports })

      return {
        orders: serializeObj(formattedOrders),
        reports: serializeObj(reports),
        cached: false,
        timestamp: now
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      return rejectWithValue(error.message)
    }
  }
)

export const fetchOrdersByIds = createAsyncThunk(
  'orders/fetchByIds',
  async ({ ordersIds }: { ordersIds: string[] }, { rejectWithValue }) => {
    try {
      if (!ordersIds || ordersIds.length === 0) {
        return { orders: [], reports: [], cached: true }
      }
      const orders = await ServiceOrders.getList(ordersIds)

      return { orders: serializeObj(orders) }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchOrdersByType = createAsyncThunk(
  'orders/fetchByType',
  async (
    params: {
      storeId: string
      type: FetchTypeOrders
      sections?: string[]
      employee?: any
      permissions?: any
      forceRefresh?: boolean
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const {
        storeId,
        type,
        employee,
        permissions,
        forceRefresh = false
      } = params
      const getExpireTomorrow = permissions.orders?.getExpireTomorrow || false

      switch (type) {
        case 'all':
          if (permissions?.canViewAllOrders) {
            return dispatch(
              fetchUnsolvedOrders({
                storeId,
                getBySections: false,
                sections: [],
                getExpireTomorrow: getExpireTomorrow,
                forceRefresh
              })
            )
          }
          break

        case 'mine':
          if (permissions?.orders?.canViewMy && employee?.sectionsAssigned) {
            return dispatch(
              fetchUnsolvedOrders({
                storeId,
                getBySections: true,
                sections: employee?.sectionsAssigned,
                getExpireTomorrow: getExpireTomorrow,
                forceRefresh
              })
            )
          }
          break

        case 'unsolved':
          return dispatch(fetchUnsolvedOrders({ storeId, forceRefresh }))

        default:
          break
      }

      return { orders: [], reports: [] }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Utility functions for normalization
const normalizeOrders = (orders: Partial<OrderType>[]) => {
  const entities: Record<string, Partial<OrderType>> = {}
  const ids: string[] = []

  orders.forEach((order) => {
    if (order.id) {
      entities[order?.id] = order
      ids.push(order.id)
    }
  })

  return { entities, ids }
}

const categorizeOrders = (
  orders: Partial<OrderType>[],
  sections: string[] = []
) => {
  const categories = {
    unsolved: [] as string[],
    solved: [] as string[],
    my: [] as string[],
    rent: [] as string[],
    repair: [] as string[],
    sale: [] as string[],
    expired: [] as string[]
  }

  orders.forEach((order) => {
    if (!order.id) return

    // Status categorization

    if (isUnsolvedOrder(order as OrderType)) {
      categories.unsolved.push(order.id)
    } else {
      categories.solved.push(order.id)
    }

    // Section categorization
    if (
      sections.length > 0 &&
      order.assignToSection &&
      sections.includes(order.assignToSection)
    ) {
      categories.my.push(order.id)
    }

    // Type categorization
    switch (order.type) {
      case order_type.RENT:
      case order_type.DELIVERY_RENT:
        categories.rent.push(order.id)
        break
      case order_type.REPAIR:
        categories.repair.push(order.id)
        break
      case order_type.SALE:
        categories.sale.push(order.id)
        break
    }

    // Expired orders
    if (order.expireAt && new Date(order.expireAt) <= new Date()) {
      categories.expired.push(order.id)
    }
  })

  return categories
}

// Slice
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Settings
    setFetchType: (state, action: PayloadAction<FetchTypeOrders>) => {
      state.fetchType = action.payload
    },

    setStoreConfig: (
      state,
      action: PayloadAction<{
        storeId: string
        sections?: string[]
        getBySections?: boolean
      }>
    ) => {
      state.storeId = action.payload.storeId
      state.sections = action.payload.sections || []
      state.getBySections = action.payload.getBySections || false
    },

    // Real-time updates
    /**
     * @deprecated this method is using deprecated orders state structure Record<string, Partial<OrderType>> but now orders is Partial<OrderType>[] | null
     * @param state
     * @param action
     */
    upsertOrder: (state, action: PayloadAction<OrderType>) => {
      const order = action.payload
      if (order.id) {
        state.orders[order.id] = order
        if (!state.orderIds.includes(order.id)) {
          state.orderIds.push(order.id)
        }

        // Update categorized lists
        const categories = categorizeOrders([order], state.sections)
        Object.entries(categories).forEach(([key, ids]) => {
          const stateKey = `${key}Orders` as keyof OrdersState
          if (Array.isArray(state[stateKey])) {
            ids.forEach((id) => {
              if (!(state[stateKey] as string[]).includes(id)) {
                ;(state[stateKey] as string[]).push(id)
              }
            })
          }
        })
      }
    },
    /**
     *  @deprecated this method is using deprecated orders state structure Record<string, Partial<OrderType>> but now orders is Partial<OrderType>[] | null
     * @param state
     * @param action
     */
    removeOrder: (state, action: PayloadAction<string>) => {
      const orderId = action.payload
      delete state.orders[orderId]
      state.orderIds = state.orderIds.filter((id) => id !== orderId)

      // Remove from all categorized lists
      state.unsolvedOrders = state.unsolvedOrders.filter((id) => id !== orderId)
      state.solvedOrders = state.solvedOrders.filter((id) => id !== orderId)
      state.myOrders = state.myOrders.filter((id) => id !== orderId)
      state.rentOrders = state.rentOrders.filter((id) => id !== orderId)
      state.repairOrders = state.repairOrders.filter((id) => id !== orderId)
      state.saleOrders = state.saleOrders.filter((id) => id !== orderId)
      state.expiredOrders = state.expiredOrders.filter((id) => id !== orderId)
    },

    // Comments and reports
    setReports: (state, action: PayloadAction<CommentType[]>) => {
      state.reports = action.payload
    },

    addComment: (state, action: PayloadAction<CommentType>) => {
      const comment = action.payload
      if (comment.id) {
        state.comments[comment.id] = comment
      }
    },

    // Cache management
    invalidateCache: (state) => {
      state.lastFetch = null
    },

    clearError: (state) => {
      state.error = null
    },

    // Reset state - útil cuando cambias de tienda o necesitas limpiar todo
    resetOrders: (state) => {
      state.orders = undefined
      state.orderIds = []
      state.unsolvedOrders = []
      state.solvedOrders = []
      state.myOrders = []
      state.rentOrders = []
      state.repairOrders = []
      state.saleOrders = []
      state.expiredOrders = []
      state.reports = []
      state.comments = {}
      state.lastFetch = null
      state.error = null
    },

    // Performance optimization
    addListener: (state, action: PayloadAction<string>) => {
      state.listeners.push(action.payload)
    },

    removeListener: (state, action: PayloadAction<string>) => {
      state.listeners = state.listeners.filter(
        (listener) => listener !== action.payload
      )
    }
  },

  extraReducers: (builder) => {
    builder
      // fetchUnsolvedOrders
      .addCase(fetchUnsolvedOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUnsolvedOrders.fulfilled, (state, action) => {
        if (action.payload.cached) {
          state.loading = false
          return
        }

        const { orders, reports, timestamp } = action.payload
        const isForceRefresh = action.meta.arg.forceRefresh

        if (orders && orders.length > 0) {
          // Normalizar las nuevas órdenes
          const { entities: newEntities, ids: newIds } = normalizeOrders(orders)
          const ordersArray = Object.values(state.orders || {}).concat(orders)
          if (isForceRefresh) {
            // ForceRefresh: reemplazar completamente las órdenes
            state.orders = ordersArray
            state.orderIds = newIds
          } else {
            // Refresh normal: combinar con las órdenes existentes sin sobrescribir
            state.orders = { ...state.orders, ...newEntities }

            // Agregar los nuevos IDs sin duplicar
            const existingIdsSet = new Set(state.orderIds)
            const idsToAdd = newIds.filter((id) => !existingIdsSet.has(id))
            state.orderIds = [...state.orderIds, ...idsToAdd]
          }

          // Recategorizar todas las órdenes para actualizar las listas filtradas
          const allOrders = Object.values(state.orders)
          const categories = categorizeOrders(allOrders, state.sections)

          state.unsolvedOrders = categories.unsolved
          state.solvedOrders = categories.solved
          state.myOrders = categories.my
          state.rentOrders = categories.rent
          state.repairOrders = categories.repair
          state.saleOrders = categories.sale
          state.expiredOrders = categories.expired
        }

        // Actualizar reports y timestamp
        state.reports = reports
        state.lastFetch = timestamp
        state.loading = false
      })
      .addCase(fetchUnsolvedOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // fetchOrdersByType
      .addCase(fetchOrdersByType.pending, (state) => {
        state.refreshing = true
        state.error = null
        state.loading = false
      })
      .addCase(fetchOrdersByType.fulfilled, (state) => {
        state.refreshing = false

        // fetchOrdersByType delega a fetchUnsolvedOrders, así que el estado ya se actualiza
        // en el reducer de fetchUnsolvedOrders.fulfilled
      })
      .addCase(fetchOrdersByType.rejected, (state, action) => {
        state.refreshing = false
        state.error = action.payload as string
      })

      // fetchOrdersByIds - agregar órdenes sin eliminar las existentes
      .addCase(fetchOrdersByIds.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrdersByIds.fulfilled, (state, action) => {
        const { orders } = action.payload
        if (orders && orders.length > 0) {
          // Normalizar las nuevas órdenes
          const { entities: newEntities, ids: newIds } = normalizeOrders(orders)

          // Combinar con las órdenes existentes
          state.orders = { ...state.orders, ...newEntities }

          // Agregar los nuevos IDs sin duplicar
          const existingIdsSet = new Set(state.orderIds)
          const idsToAdd = newIds.filter((id) => !existingIdsSet.has(id))
          state.orderIds = [...state.orderIds, ...idsToAdd]

          // Recategorizar todas las órdenes para actualizar las listas filtradas
          const allOrders = Object.values(state.orders)
          const categories = categorizeOrders(allOrders, state.sections)
          state.unsolvedOrders = categories.unsolved
          state.solvedOrders = categories.solved
          state.myOrders = categories.my
          state.rentOrders = categories.rent
          state.repairOrders = categories.repair
          state.saleOrders = categories.sale
          state.expiredOrders = categories.expired
        }

        state.loading = false
      })
      .addCase(fetchOrdersByIds.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

// Selectors
export const selectAllOrders = (state: { orders: OrdersState }) =>
  state.orders.orderIds.map((id) => state.orders.orders[id])

export const selectUnsolvedOrders = (state: { orders: OrdersState }) =>
  state.orders.unsolvedOrders.map((id) => state.orders.orders[id])

export const selectMyOrders = (state: { orders: OrdersState }) =>
  state.orders.myOrders.map((id) => state.orders.orders[id])

export const selectOrdersByType = (
  state: { orders: OrdersState },
  type: string
) => {
  const key = `${type}Orders` as keyof OrdersState
  const orderIds = state.orders[key] as string[]
  return orderIds?.map((id) => state.orders.orders[id]) || []
}

export const selectOrderById = (
  state: { orders: OrdersState },
  orderId: string
) => state.orders.orders[orderId]

export const selectOrdersLoading = (state: { orders: OrdersState }) =>
  state.orders.loading

export const selectOrdersError = (state: { orders: OrdersState }) =>
  state.orders.error

export const selectReports = (state: { orders: OrdersState }) =>
  state.orders.reports

export const selectOrdersStats = (state: { orders: OrdersState }) => ({
  total: state.orders.orderIds.length,
  unsolved: state.orders.unsolvedOrders.length,
  solved: state.orders.solvedOrders.length,
  my: state.orders.myOrders.length,
  rent: state.orders.rentOrders.length,
  repair: state.orders.repairOrders.length,
  sale: state.orders.saleOrders.length,
  expired: state.orders.expiredOrders.length
})

// Actions
export const {
  setFetchType,
  setStoreConfig,
  upsertOrder,
  removeOrder,
  setReports,
  addComment,
  invalidateCache,
  clearError,
  resetOrders,
  addListener,
  removeListener
} = ordersSlice.actions

// Reducer
export const ordersReducer = ordersSlice.reducer

export default ordersSlice.reducer
