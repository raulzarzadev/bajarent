import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CustomerType } from './customerType'
import {
  createCustomer as createCustomerThunk,
  fetchCustomers,
  updateCustomer as updateCustomerThunk
} from './customersThunks'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../store'
import { produce } from 'immer'
import StoreType from '../../../types/StoreType'

export type CustomersState = {
  data: CustomerType[]
  loading: boolean
  error: string | null
}
export const initialState: CustomersState = {
  data: [],
  loading: true,
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
      .addCase(createCustomerThunk.fulfilled, (state, action) => {
        state.data.push(action.payload)
      })
      .addCase(createCustomerThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create customer'
      })
      .addCase(updateCustomerThunk.fulfilled, (state, action) => {
        state.loading = false
        const { id, ...changes } = action.payload
        const index = state.data.findIndex((c) => c.id === action.payload.id)
        state.data[index] = produce(state.data[index], (draft) => {
          for (const key in changes) {
            if (
              typeof changes[key] === 'object' &&
              !Array.isArray(changes[key])
            ) {
              draft[key] = {
                ...draft[key],
                ...changes[key]
              }
            } else {
              draft[key] = changes[key]
            }
          }
        })
      })
      .addCase(updateCustomerThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update customer'
      })
  }
})

export const { addCustomer, removeCustomer } = customersSlice.actions

export const selectCustomers = (state: { customers: CustomersState }) => {
  return state.customers
}

export const customersReducer = customersSlice.reducer

export const useCustomers = () => {
  const dispatch = useDispatch<AppDispatch>()
  const update = async (id: string, changes: Partial<CustomerType>) => {
    return await dispatch(
      updateCustomerThunk({
        customer: changes,
        customerId: id
      })
    )
  }
  const create = async (
    storeId: StoreType['id'],
    customer: Partial<CustomerType>
  ) => {
    return await dispatch(createCustomerThunk({ customer, storeId }))
  }
  const customers = useSelector(selectCustomers)
  return {
    ...customers,
    update,
    create
  }
}
