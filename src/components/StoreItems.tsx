import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { gStyles } from '../styles'
import ListStoreItems from './ListStoreItems'
import { useStore } from '../contexts/storeContext'

const StoreItems = () => {
  const { items } = useStore()

  return (
    <View style={{ marginTop: 16 }}>
      <Text style={[gStyles.h3, { textAlign: 'left' }]}>Artículos</Text>
      <ListStoreItems items={items} />
    </View>
  )
}

export default StoreItems

const styles = StyleSheet.create({})
