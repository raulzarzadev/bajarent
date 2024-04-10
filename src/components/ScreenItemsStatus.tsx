import { StyleSheet } from 'react-native'
import React from 'react'
import { useStore } from '../contexts/storeContext'
import ItemsStats from './ItemsStats'

const ScreenItemsStatus = () => {
  const { orders } = useStore()
  return <ItemsStats orders={orders} />
}

export default ScreenItemsStatus

const styles = StyleSheet.create({})
