import { configureStore } from '@reduxjs/toolkit'
import { customersReducer } from './features/costumers/costumersSlice'
import { counterReducer } from './features/counter/counterSlice'
import { currentWorkReducer } from './features/currentWork/currentWorkSlice'
import { ordersReducer } from './features/orders/ordersSlice'
import { shopReducer } from './features/shop/shopSlice'

export const store = configureStore({
	reducer: {
		counter: counterReducer,
		customers: customersReducer,
		currentWork: currentWorkReducer,
		orders: ordersReducer,
		shop: shopReducer
	}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
