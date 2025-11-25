import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import StoreType from '../../../types/StoreType'
import { getFullStoreData } from '../../../contexts/libs/getFullStoreData'

import { RootState } from '../../store'

// Define the initial state interface
interface ShopState {
  shop?: StoreType | null
}

const initialState: ShopState = {
  shop: undefined
}

export const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setShop: (state, action: PayloadAction<StoreType | null>) => {
      state.shop = action.payload
    }
  }
})

export const { setShop } = shopSlice.actions

export const selectShop = (state: RootState) => state.shop

export const shopReducer = shopSlice.reducer
export default shopSlice.reducer

export const fetchShop = createAsyncThunk(
  'shop/fetchShop',
  async (storeId: string, thunkAPI) => {
    getFullStoreData(storeId)
      .then((res) => {
        thunkAPI.dispatch(shopSlice.actions['shop/setShop'](res ? res : null))
      })
      .catch((e) => console.error({ e }))
  }
)
