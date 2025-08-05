import { useEffect } from 'react'
import { useCustomers } from './features/costumers/costumersSlice'
import { useCurrentWorkFetch } from './features/currentWork/currentWorkSlice'
import { useOrdersCtx } from '../contexts/ordersContext'
import { useAuth } from '../contexts/authContext'
import { authStateChanged } from '../firebase/auth'
import { getItem } from '../libs/storage'

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
