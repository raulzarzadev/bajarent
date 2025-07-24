import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useCallback } from 'react'
import { AppDispatch, RootState } from '../state/store'
import {
  fetchUnsolvedOrders,
  fetchOrdersByType,
  setFetchType,
  setStoreConfig,
  invalidateCache,
  addListener,
  removeListener,
  selectAllOrders,
  selectUnsolvedOrders,
  selectMyOrders,
  selectOrdersByType,
  selectOrdersLoading,
  selectOrdersError,
  selectReports,
  selectOrdersStats,
  FetchTypeOrders
} from '../state/features/orders/ordersSlice'
import { useAuth } from '../contexts/authContext'
import { useEmployee } from '../contexts/employeeContext'
import { formatOrders } from '../libs/orders'
import { useCustomers } from '../state/features/costumers/costumersSlice'

export const useOrdersRedux = (componentId?: string) => {
  const dispatch = useDispatch<AppDispatch>()
  const { storeId } = useAuth()
  const { employee, permissions, disabledEmployee } = useEmployee()

  // Selectors
  const allOrders = useSelector(selectAllOrders)
  const unsolvedOrders = useSelector(selectUnsolvedOrders)
  const myOrders = useSelector(selectMyOrders)
  const loading = useSelector(selectOrdersLoading)
  const error = useSelector(selectOrdersError)
  const reports = useSelector(selectReports)
  const stats = useSelector(selectOrdersStats)

  const { data: customers } = useCustomers()
  const ordersState = useSelector((state: RootState) => state.orders)

  // Register component listener for performance tracking
  useEffect(() => {
    if (componentId) {
      dispatch(addListener(componentId))
      return () => {
        dispatch(removeListener(componentId))
      }
    }
  }, [dispatch, componentId])

  // Configure store settings when available
  useEffect(() => {
    if (storeId && employee?.sectionsAssigned) {
      dispatch(
        setStoreConfig({
          storeId,
          sections: employee.sectionsAssigned,
          getBySections: !permissions?.canViewAllOrders
        })
      )
    }
  }, [
    dispatch,
    storeId,
    employee?.sectionsAssigned,
    permissions?.canViewAllOrders
  ])

  // Auto-fetch orders on authentication and permissions change
  useEffect(() => {
    if (
      storeId &&
      !disabledEmployee &&
      (permissions?.isAdmin ||
        permissions?.orders?.canViewMy ||
        permissions?.canViewAllOrders)
    ) {
      const fetchType: FetchTypeOrders = permissions?.canViewAllOrders
        ? 'all'
        : 'mine'

      dispatch(
        fetchOrdersByType({
          storeId,
          type: fetchType,
          sections: employee?.sectionsAssigned || [],
          employee,
          permissions
        })
      )
    }
  }, [dispatch, storeId, disabledEmployee, permissions, employee])

  // Methods
  const refreshOrders = useCallback(async () => {
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
        permissions
      })
    )
  }, [dispatch, storeId, permissions, employee])

  const forceRefresh = useCallback(async () => {
    if (!storeId) return

    dispatch(invalidateCache())
    return refreshOrders()
  }, [dispatch, storeId, refreshOrders])

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
            permissions
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
      listenersCount: ordersState.listeners.size,
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

  return {
    // Data
    orders: formatOrders({ orders: allOrders, reports, customers }),
    unsolvedOrders,
    myOrders,
    reports,
    stats,

    // State
    loading,
    error,
    fetchType: ordersState.fetchType,

    // Methods
    refreshOrders,
    forceRefresh,
    changeFetchType,
    getOrdersByType,

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
