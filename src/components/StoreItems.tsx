import { StyleSheet, View } from 'react-native'
import React from 'react'
import ListStoreItems from './ListStoreItems'

const StoreItems = () => {
  return (
    <View style={{ marginTop: 16 }}>
      <ListStoreItems allItems />
    </View>
  )
}

export default StoreItems

const styles = StyleSheet.create({})
