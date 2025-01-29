import { configureStore } from '@reduxjs/toolkit'
import { counterReducer } from './features/counter/counterSlice'
import { customersReducer } from './features/costumers/costumersSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    customers: customersReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
