import { useEmployee } from '../contexts/employeeContext'
import { useEffect } from 'react'
import { useCustomers } from './features/costumers/costumersSlice'

export const ReduxInitializer = ({ children }) => {
  const { employee } = useEmployee()
  //*****************************
  //* REDUX WILL BE CHARGED IN THIS CONTEXT
  //******************************
  //->>>
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
