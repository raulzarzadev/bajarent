import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CustomerType } from './customerType'
import {
  createCustomer,
  fetchCustomers,
  updateCustomer
} from './customersThunks'
import { useSelector } from 'react-redux'

export type CustomersState = {
  data: CustomerType[]
  loading: boolean
  error: string | null
}
export const initialState: CustomersState = {
  data: [],
  loading: false,
  error: null
}
export const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    addCustomer: (state, action: PayloadAction<CustomerType>) => {
      //* Tal vex aqui sea necesario primero obtener el id del customer y luego asignarlo al state
      state[action.payload.id] = action.payload
    },
    removeCustomer: (state, action: PayloadAction<CustomerType['id']>) => {
      delete state[action.payload]
    },
    updateCustomer: (state, action: PayloadAction<Partial<CustomerType>>) => {
      const { id, ...rest } = action.payload
      if (id && state[id]) {
        state[id] = {
          ...state[id],
          ...rest
        }
      } else {
        console.error('Customer not found', action.payload)
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch customers'
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.data.push(action.payload)
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create customer'
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.data.findIndex((c) => c.id === action.payload.id)
        state.data[index] = action.payload
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update customer'
      })
  }
})

export const { addCustomer, removeCustomer } = customersSlice.actions

export const selectCustomers = (state: { customers: CustomersState }) =>
  state.customers

export const customersReducer = customersSlice.reducer

export const useCustomers = () => useSelector(selectCustomers)
