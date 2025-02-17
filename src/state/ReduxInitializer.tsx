import { useEmployee } from '../contexts/employeeContext'
import { useEffect } from 'react'
import { useCustomers } from './features/costumers/costumersSlice'
import { useCurrentWork } from './features/currentWork/currentWorkSlice'

export const ReduxInitializer = ({ children }) => {
  const { employee } = useEmployee()
  //*****************************
  //* REDUX WILL BE CHARGED IN THIS CONTEXT
  //******************************
  //->>>
  useCurrentWork()
  const { fetch: fetchCustomers } = useCustomers()
  const canReadCustomers = !!employee?.permissions?.customers?.read
  useEffect(() => {
    canReadCustomers && fetchCustomers()
  }, [canReadCustomers])
  //->>>
  //*****************************
  //* REDUX WILL BE CHARGED IN THIS CONTEXT
  //******************************

  return children
}
