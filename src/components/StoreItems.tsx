import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { gStyles } from '../styles'
import ListStoreItems from './ListStoreItems'

const StoreItems = () => {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={[gStyles.h3, { textAlign: 'left' }]}>Artículos</Text>
      <ListStoreItems />
    </View>
  )
}

export default StoreItems

const styles = StyleSheet.create({})
