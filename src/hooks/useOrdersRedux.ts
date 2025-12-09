import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../contexts/authContext'
import { useEmployee } from '../contexts/employeeContext'
import { formatOrders, isUnsolvedOrder } from '../libs/orders'
import { useCustomers } from '../state/features/costumers/costumersSlice'
import {
  type FetchTypeOrders,
  fetchOrdersByIds,
  fetchOrdersByType,
  resetOrders,
  selectAllOrders,
  selectMyOrders,
  selectOrdersByType,
  selectOrdersError,
  selectOrdersLoading,
  selectOrdersStats,
  selectReports,
  setFetchType
} from '../state/features/orders/ordersSlice'
import type { AppDispatch, RootState } from '../state/store'

export const useOrdersRedux = (componentId?: string) => {
  const dispatch = useDispatch<AppDispatch>()
  const { storeId } = useAuth()
  const { employee, permissions, disabledEmployee } = useEmployee()

  // Selectors
  const allOrders = useSelector(selectAllOrders)
  const myOrders = useSelector(selectMyOrders)
  const loading = useSelector(selectOrdersLoading)
  const error = useSelector(selectOrdersError)
  const reports = useSelector(selectReports)
  const stats = useSelector(selectOrdersStats)
  const { data: customers } = useCustomers()
  const ordersState = useSelector((state: RootState) => state.orders)

  const refreshOrders = useCallback(
    async (forceRefresh: boolean = false) => {
      if (!storeId) return

      const fetchType: FetchTypeOrders = permissions?.canViewAllOrders
        ? 'all'
        : 'mine'

      return dispatch(
        fetchOrdersByType({
          storeId,
          type: fetchType,
          sections: employee?.sectionsAssigned || [],
          employee,
          permissions,
          forceRefresh
        })
      )
    },
    [dispatch, storeId, permissions, employee]
  )

  const forceRefresh = useCallback(async () => {
    return refreshOrders(true)
  }, [refreshOrders])

  const changeFetchType = useCallback(
    (type: FetchTypeOrders) => {
      dispatch(setFetchType(type))

      if (storeId) {
        dispatch(
          fetchOrdersByType({
            storeId,
            type,
            sections: employee?.sectionsAssigned || [],
            employee,
            permissions,
            forceRefresh: true // Cuando cambias el tipo, quieres reemplazar las órdenes
          })
        )
      }
    },
    [dispatch, storeId, employee, permissions]
  )

  const getOrdersByType = useCallback((type: string) => {
    return useSelector((state: RootState) => selectOrdersByType(state, type))
  }, [])

  // Performance metrics (dev only)
  const getPerformanceMetrics = useCallback(() => {
    if (!__DEV__) return null

    return {
      totalOrders: stats.total,
      listenersCount: ordersState.listeners.length,
      cacheAge: ordersState.lastFetch
        ? Date.now() - ordersState.lastFetch
        : null,
      isExpired: ordersState.lastFetch
        ? Date.now() - ordersState.lastFetch > ordersState.cacheExpiry
        : true,
      memoryUsage: {
        orders: Object.keys(ordersState.orders).length,
        reports: ordersState.reports.length,
        comments: Object.keys(ordersState.comments).length
      }
    }
  }, [stats, ordersState])

  const setSomeOtherOrders = ({ ordersIds }: { ordersIds: string[] }) => {
    const uniqueOrdersIds = Array.from(new Set(ordersIds))
    dispatch(
      fetchOrdersByIds({
        ordersIds: uniqueOrdersIds
      })
    )
  }

  const clearAllOrders = useCallback(() => {
    dispatch(resetOrders())
  }, [dispatch])

  const allFormattedOrders = formatOrders({
    orders: allOrders,
    reports,
    customers
  })

  return {
    // Data
    orders: allFormattedOrders,
    unsolvedOrders: allFormattedOrders.filter(isUnsolvedOrder).filter(
      // filter out orders that are not assigned to me
      (order) =>
        permissions.canViewAllOrders
          ? true
          : employee.sectionsAssigned.includes(order.assignToSection)
    ),
    myOrders,
    reports,
    stats,
    setSomeOtherOrders,

    // State
    loading,
    error,
    fetchType: ordersState.fetchType,

    // Methods
    refreshOrders,
    forceRefresh,
    changeFetchType,
    getOrdersByType,
    clearAllOrders,

    // Utils
    getPerformanceMetrics,

    // Raw state for advanced usage
    ordersState
  }
}

// Specialized hooks for specific use cases
export const useMyOrders = (componentId?: string) => {
  const hook = useOrdersRedux(componentId)
  return {
    orders: hook.myOrders,
    loading: hook.loading,
    error: hook.error,
    refresh: hook.refreshOrders,
    stats: {
      total: hook.stats.my,
      expired: hook.stats.expired
    }
  }
}

export const useUnsolvedOrders = (componentId?: string) => {
  const hook = useOrdersRedux(componentId)
  return {
    orders: hook.unsolvedOrders,
    loading: hook.loading,
    error: hook.error,
    refresh: hook.refreshOrders,
    stats: {
      total: hook.stats.unsolved,
      rent: hook.stats.rent,
      repair: hook.stats.repair,
      sale: hook.stats.sale
    }
  }
}

export const useOrdersStats = () => {
  const stats = useSelector(selectOrdersStats)
  const loading = useSelector(selectOrdersLoading)

  return {
    stats,
    loading,
    isEmpty: stats.total === 0
  }
}

// Migration helper - provides same interface as old context
export const useOrdersCtxCompatible = () => {
  const hook = useOrdersRedux('compatibility-layer')

  return {
    orders: hook.orders,
    reports: hook.reports,
    handleRefresh: hook.refreshOrders,
    fetchTypeOrders: hook.fetchType,
    setFetchTypeOrders: hook.changeFetchType,
    orderTypeOptions: [
      { label: 'Todas', value: 'all' as FetchTypeOrders },
      { label: 'Mis órdenes', value: 'mine' as FetchTypeOrders },
      { label: 'Sin resolver', value: 'unsolved' as FetchTypeOrders },
      { label: 'Resueltas', value: 'solved' as FetchTypeOrders }
    ]
  }
}
