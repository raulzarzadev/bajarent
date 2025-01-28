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
    return await ServiceCustomers.update(customerId, customer)
      .then(() => {
        return customer
      })
      .catch((error) => {
        console.error('Error updating document: ', error)
        return null
      })
  }
)
