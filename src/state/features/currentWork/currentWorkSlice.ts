import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  CurrentWorkType,
  CurrentWorkUpdate,
  CurrentWorkUpdateDetails,
  NewWorkUpdate
} from '../../../components/CurrentWork/CurrentWorkType'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ServiceCurrentWork } from '../../../components/CurrentWork/ServiceCurrentWork'
import { useStore } from '../../../contexts/storeContext'
import { useAuth } from '../../../contexts/authContext'
import { convertTimestamps } from '../../../libs/utils-date'
import { createUUID } from '../../../libs/createId'

export type CurrentWorkState = {
  data: CurrentWorkType
  loading: boolean
  error: string | null
}
export const initialState: CurrentWorkState = {
  data: undefined,
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
    },
    addWork(state, action: PayloadAction<CurrentWorkUpdate>) {
      state.data = {
        ...state.data,
        updates: {
          [action.payload.id]: action.payload,
          ...(state?.data?.updates || {})
        }
      }
    }
  }
})

export const {
  fetchCurrentWorkRequest,
  fetchCurrentWorkSuccess,
  fetchCurrentWorkFailure,
  addWork: addWorkToCurrentWork
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
    ServiceCurrentWork.getByDate({ storeId })
      .then((data) => {
        update(data || null)
      })
      .catch((error) => dispatch(fetchCurrentWorkFailure(error.message)))
  }
  const addWork = async ({ work }: { work?: NewWorkUpdate }) => {
    await ServiceCurrentWork.addWork({
      storeId,
      work,
      userId: user.id
    }).then((res: CurrentWorkUpdate) => {
      const serializableRes = convertTimestamps(
        {
          ...res,
          createdAt: new Date() //*<--- this a temporal date until in the next fetch bring the real server date stamp
        },
        { to: 'string' }
      )
      dispatch(addWorkToCurrentWork(serializableRes))
    })
  }
  return { ...currentWork, update, fetch, addWork }
}
