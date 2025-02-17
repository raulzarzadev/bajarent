import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  CurrentWorkType,
  NewWorkUpdate
} from '../../../components/CurrentWork/CurrentWorkType'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ServiceCurrentWork } from '../../../components/CurrentWork/ServiceCurrentWork'
import { useStore } from '../../../contexts/storeContext'
import { useAuth } from '../../../contexts/authContext'
import { convertTimestamps } from '../../../libs/utils-date'

export type CurrentWorkState = {
  data: CurrentWorkType
  loading: boolean
  error: string | null
}
export const initialState: CurrentWorkState = {
  data: null,
  loading: false,
  error: null
}
export const currentWorkSlice = createSlice({
  name: 'currentWork',
  initialState,
  reducers: {
    fetchCurrentWorkRequest(state) {
      state.loading = true
      state.error = null
    },
    fetchCurrentWorkSuccess(state, action: PayloadAction<CurrentWorkType>) {
      state.loading = false
      state.data = convertTimestamps(action.payload, { to: 'string' })
    },
    fetchCurrentWorkFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    }
  }
})

export const {
  fetchCurrentWorkRequest,
  fetchCurrentWorkSuccess,
  fetchCurrentWorkFailure
} = currentWorkSlice.actions

export const selectCurrentWork = (state: { currentWork: CurrentWorkState }) =>
  state.currentWork

export const currentWorkReducer = currentWorkSlice.reducer

export const useCurrentWork = () => {
  const dispatch = useDispatch()

  const { storeId } = useStore()
  const { user } = useAuth()
  const currentWork = useSelector(selectCurrentWork)

  useEffect(() => {
    if (storeId) {
      fetch()
    } else {
      update(null)
    }
  }, [storeId])

  const update = (data) =>
    dispatch(fetchCurrentWorkSuccess(convertTimestamps(data, { to: 'string' })))

  const fetch = () => {
    ServiceCurrentWork.getTodayWork(storeId)
      .then((data) => {
        update(data)
      })
      .catch((error) => dispatch(fetchCurrentWorkFailure(error.message)))
  }
  const addWork = ({ work }: { work?: NewWorkUpdate }) => {
    ServiceCurrentWork.addWork({
      storeId,
      work,
      userId: user.id
    }).then((res) => {
      update(res)
    })
  }
  return { ...currentWork, update, fetch, addWork }
}
