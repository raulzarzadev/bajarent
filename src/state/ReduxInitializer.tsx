import { useEffect } from 'react'
import { useCustomers } from './features/costumers/costumersSlice'
import { useCurrentWorkFetch } from './features/currentWork/currentWorkSlice'
import { FetchTypeOrders, useOrdersCtx } from '../contexts/ordersContext'
import { useAuth } from '../contexts/authContext'
import { authStateChanged } from '../firebase/auth'
import { getItem } from '../libs/storage'
import { useStore } from '../contexts/storeContext'
import { useDispatch } from 'react-redux'
import { AppDispatch } from './store'
import { useEmployee } from '../contexts/employeeContext'
import {
  fetchOrdersByType,
  setStoreConfig
} from './features/orders/ordersSlice'

export const ReduxInitializer = ({ children }) => {
  // * ========================================
  const { setAuth, handleSetStoreId, handleSetUserStores } = useAuth()
  useEffect(() => {
    authStateChanged((user) => {
      setAuth({ isAuthenticated: !!user, user })
      if (user) {
        handleSetUserStores(user.id)
      }
    })
    getItem('storeId').then((res) => {
      handleSetStoreId(res)
    })
  }, [])

  // useEffect(() => {
  //   if (auth.user === null) {
  //     toProfile()
  //   }
  //   if (auth.user) {
  //     getUserStores()
  //   }
  // }, [auth.user])
  // * ========================================
  //*****************************
  //* REDUX WILL BE CHARGED IN THIS CONTEXT
  //******************************
  //->>>

  //************* initialize orders context
  useInitializeOrdersState()

  useCurrentWorkFetch()

  //** ---- FETCHING CUSTOMERS JUST ONCE----- */
  const { fetch: fetchCustomers } = useCustomers()
  const { orders } = useOrdersCtx()
  useEffect(() => {
    fetchCustomers({ ids: orders?.map((o) => o.customerId) })
  }, [orders])
  //** ---- FETCHING CUSTOMERS ----- */

  //->>>
  //*****************************
  //* REDUX WILL BE CHARGED IN THIS CONTEXT
  //******************************
  return children
}

const useInitializeOrdersState = () => {
  // // Register component listener for performance tracking
  // useEffect(() => {
  //   if (componentId) {
  //     dispatch(addListener(componentId))
  //     return () => {
  //       dispatch(removeListener(componentId))
  //     }
  //   }
  // }, [dispatch, componentId])
  const { storeId } = useStore()
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
