import { createAsyncThunk } from '@reduxjs/toolkit'
import { CustomerType } from './customerType'
import { ServiceCustomers } from '../../../firebase/ServiceCustomers'
import { convertTimestamps } from '../../../libs/utils-date'

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async ({ storeId }: { storeId: string }): Promise<CustomerType[]> => {
    const response = await ServiceCustomers.getByStore(storeId)
    const customers = response.map((customer) =>
      convertTimestamps(customer, { to: 'string' })
    )
    return customers
  }
)

export const createCustomer = createAsyncThunk(
  'customers/newCustomer',
  async ({
    customer,
    storeId
  }: {
    customer: Partial<CustomerType>
    storeId: string
  }): Promise<CustomerType> => {
    const newCustomer = { ...customer, storeId }
    const response = await ServiceCustomers.create(newCustomer)
      .then(({ res }) => {
        return { ...newCustomer, id: res.id }
      })
      .catch((error) => {
        console.error('Error adding document: ', error)
        return null
      })
    return response
  }
)
export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async ({
    customer,
    customerId
  }: {
    customer: Partial<CustomerType>
    customerId: string
  }): Promise<CustomerType> => {
    return await ServiceCustomers.update(customerId, customer).then(() => {
      //* pass serializable data to redux store
      const changes = convertTimestamps(customer, { to: 'string' })
      return {
        ...changes,
        id: customerId
      }
    })
    // .catch((error) => {
    //   console.error('Error updating document: ', error)
    //   return null
    // })
  }
)

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (customerId: string): Promise<string> => {
    return await ServiceCustomers.delete(customerId)
      .then(() => {
        return customerId
      })
      .catch((error) => {
        console.error('Error deleting document: ', error)
        return null
      })
  }
)
