import { View, Text, Image } from 'react-native'
import React from 'react'
import OrderType from '../types/OrderType'
import ImagePreview from './ImagePreview'

const OrderImages = ({ order }: { order: Partial<OrderType> }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <ImagePreview image={order?.imageID} title="Imagen ID" />
      <ImagePreview image={order?.imageHouse} title="Imagen Casa" />
      {/* {!!order?.imageID && (
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
      )} */}
    </View>
  )
}

export default OrderImages
