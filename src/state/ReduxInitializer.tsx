import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useAuth } from '../contexts/authContext'
import { useEmployee } from '../contexts/employeeContext'
import type { FetchTypeOrders } from '../contexts/ordersContext'
import { authStateChanged } from '../firebase/auth'
import { ServiceSections } from '../firebase/ServiceSections'
import { ServiceStores } from '../firebase/ServiceStore'
import { useOrdersRedux } from '../hooks/useOrdersRedux'
import { getItem } from '../libs/storage'
import { convertTimestamps } from '../libs/utils-date'
import { useCustomers } from './features/costumers/costumersSlice'
import { useCurrentWorkFetch } from './features/currentWork/currentWorkSlice'
import {
  fetchOrdersByType,
  setStoreConfig
} from './features/orders/ordersSlice'
import { setShop } from './features/shop/shopSlice'
import type { AppDispatch } from './store'

export const ReduxInitializer = ({ children }) => {
  // * ========================================
  const { setAuth, handleSetStoreId, handleSetUserStores } = useAuth()

  useEffect(() => {
    const unsubscribe = authStateChanged((user) => {
      setAuth({ isAuthenticated: !!user, user })
      handleSetUserStores(user?.id)
    })
    getItem('storeId').then((res) => {
      if (res) {
        handleSetStoreId(res)
      }
    })
    return () => unsubscribe?.()
  }, [])

  // * ========================================
  //*****************************
  //* REDUX WILL BE CHARGED IN THIS CONTEXT
  //******************************
  //->>>

  //************* initialize orders context
  useInitializeOrdersState()

  useCurrentWorkFetch()

  useInitializeShop()

  //** ---- FETCHING CUSTOMERS JUST ONCE----- */
  useInitializeCustomers()
  //** ---- FETCHING CUSTOMERS ----- */

  //->>>
  //*****************************
  //* REDUX WILL BE CHARGED IN THIS CONTEXT
  //******************************
  return children
}

const useInitializeOrdersState = () => {
  const { storeId } = useAuth()
  const { employee, permissions, disabledEmployee } = useEmployee()
  const dispatch = useDispatch<AppDispatch>()

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
          permissions,
          forceRefresh: false // En el inicio, no necesitas forzar refresh
        })
      )
    }
  }, [dispatch, storeId, disabledEmployee, permissions, employee])
}

const useInitializeShop = () => {
  const { storeId } = useAuth()
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    if (!storeId) return
    const unsubscribe = ServiceStores.listen(storeId, async (store) => {
      const sections = await ServiceSections.getByStore(storeId)
      const normalizeData = convertTimestamps(
        { ...store, sections },
        { to: 'string' }
      )
      dispatch(setShop(normalizeData))
    })
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
    }
  }, [storeId])
  return null
}

const useInitializeCustomers = () => {
  const { fetch: fetchCustomers, data } = useCustomers()
  const { orders, loading } = useOrdersRedux()

  useEffect(() => {
    if (loading === false) {
      getItem('')
      const uniqueCustomerIds = Array.from(
        new Set(orders?.map((o) => o.customerId).filter((id) => id))
      )
      console.log({ orders: uniqueCustomerIds, loading })
      if (uniqueCustomerIds.length) fetchCustomers({ ids: uniqueCustomerIds })
    }
  }, [loading])
  console.log({ data })
  return null
}
