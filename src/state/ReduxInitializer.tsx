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
  useCustomers()

  //->>>
  //*****************************
  //* REDUX WILL BE CHARGED IN THIS CONTEXT
  //******************************

  return children
}
