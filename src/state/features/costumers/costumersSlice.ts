import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CustomerType } from './customerType'
import {
  createCustomer as createCustomerThunk,
  fetchCustomers,
  updateCustomer as updateCustomerThunk,
  deleteCustomer as deleteCustomerThunk
} from './customersThunks'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../store'
import { produce } from 'immer'
import StoreType from '../../../types/StoreType'
import { ServiceOrders } from '../../../firebase/ServiceOrders'

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
      //* ----> FETCHING CUSTOMER
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
      //* ----> CREATE CUSTOMER
      .addCase(createCustomerThunk.fulfilled, (state, action) => {
        state.data.push(action.payload)
      })
      .addCase(createCustomerThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create customer'
      })
      //* ----> UPDATE CUSTOMER
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
      //* ----> DELETE CUSTOMER
      .addCase(deleteCustomerThunk.fulfilled, (state, action) => {
        state.data = state.data.filter((c) => c.id !== action.payload)
      })
      .addCase(deleteCustomerThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete customer'
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

  const remove = async (id: string) => {
    return await dispatch(deleteCustomerThunk(id))
  }

  const handleCreateCustomer = async ({
    option,
    storeId,
    newCustomer,
    orderId
  }: {
    option: CreateCustomerChoiceType
    storeId: StoreType['id']
    newCustomer: Partial<CustomerType>
    orderId: string
  }): Promise<{
    option: CreateCustomerChoiceType
    customer: Partial<CustomerType>
    orderUpdatedId?: string
    statusOk: boolean
  }> => {
    if (option === 'cancel') {
      return {
        option: 'cancel',
        customer: newCustomer,
        statusOk: true
      }
    }
    if (option === 'create') {
      // update order and create customer
      const customerCreated = await create(storeId, newCustomer)
        .then((res) => {
          //console.log('create customer')
          const customer = res.payload as CustomerType
          return customer
          // add customer create to a list of current customers to avoid create more than the same
        })
        .catch((error) => {
          //console.error('Error creating customer', error)
          return error
        })
      if (!customerCreated?.res?.ok) {
        const orderUpdated = await ServiceOrders.update(orderId, {
          //@ts-ignore
          customerId: customerCreated.id
        })
          .then((res) => {
            // console.log('update order')
            return res
          })
          .catch((error) => {
            // console.error('Error updating order', error)
            return error
          })
        return {
          option: 'create',
          customer: customerCreated,
          orderUpdatedId: orderUpdated?.res?.id,
          statusOk: true
        }
      } else {
        return {
          option: 'create',
          customer: customerCreated,
          statusOk: false
        }
      }
    }
    if (option === 'merge') {
      // just update order

      return await ServiceOrders.update(orderId, {
        customerId: newCustomer.id
      })
        .then((res) => {
          console.log('update order')
          console.log({ res })
          return {
            option: 'merge' as const, // explicitamos el literal "merge",
            customer: newCustomer,
            //@ts-ignore
            orderUpdatedId: res?.res?.id,
            statusOk: true
          }
        })
        .catch((error) => {
          console.error('Error creating customer', error)
          return {
            option: 'merge',
            customer: newCustomer,
            orderUpdatedId: error.res.id,
            statusOk: false
          }
        })
    }
  }

  const customers = useSelector(selectCustomers)

  return {
    ...customers,
    update,
    create,
    remove,
    handleCreateCustomer
  }
}
export type CreateCustomerChoiceType = 'cancel' | 'merge' | 'create'
