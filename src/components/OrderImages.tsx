import { View, Text, Image } from 'react-native'
import React from 'react'
import OrderType from '../types/OrderType'

const OrderImages = ({ order }: { order: Partial<OrderType> }) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      {!!order?.imageID && (
        <Image
          source={{ uri: order?.imageID }}
          style={{ flex: 1, minHeight: 150, marginVertical: 2 }}
        />
      )}
      {!!order?.imageHouse && (
        <Image
          source={{ uri: order?.imageHouse }}
          style={{ flex: 1, minHeight: 150, marginVertical: 2 }}
        />
      )}
    </View>
  )
}

export default OrderImages
