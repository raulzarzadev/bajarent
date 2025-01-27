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
