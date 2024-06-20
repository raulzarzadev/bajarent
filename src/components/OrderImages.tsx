import { View, Text, Image } from 'react-native'
import React from 'react'
import OrderType from '../types/OrderType'
import ImagePreview from './ImagePreview'

const OrderImages = ({ order }: { order: Partial<OrderType> }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <ImagePreview image={order?.imageID} title="Imagen ID" />
      <ImagePreview image={order?.imageHouse} title="Imagen Casa" />
    </View>
  )
}

export default OrderImages
