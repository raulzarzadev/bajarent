import { useEffect } from 'react'
import { useCustomers } from './features/costumers/costumersSlice'
import { useCurrentWorkFetch } from './features/currentWork/currentWorkSlice'
import { useOrdersCtx } from '../contexts/ordersContext'

export const ReduxInitializer = ({ children }) => {
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
