import { configureStore } from '@reduxjs/toolkit'
import { counterReducer } from './features/counter/counterSlice'
import { customersReducer } from './features/costumers/costumersSlice'
import { currentWorkReducer } from './features/currentWork/currentWorkSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    customers: customersReducer,
    currentWork: currentWorkReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
