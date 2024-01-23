import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import StoreDetails from './StoreDetails'
import { useStore } from '../contexts/storeContext'

const ScreenStore = () => {
  const { store } = useStore()
  return (
    <View>
      <StoreDetails store={store} />
    </View>
  )
}

export default ScreenStore

const styles = StyleSheet.create({})
