import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { useState } from 'react'
import { STATUS_COLOR } from '../theme'
import dictionary from '../dictionary'
import { useStore } from '../contexts/storeContext'

const OrderStatus = ({
  orderId,
  style
}: {
  orderId?: string
  style?: ViewStyle
}) => {
  const { orders } = useStore()
  const order = orders.find((order) => order.id === orderId)
  const status = order?.status
  const color = STATUS_COLOR[order?.status]
  const hasReport = order?.hasNotSolvedReports
  const [width, setWidth] = useState(0)
  const MIN_WIDTH = 120

  const displayText = dictionary(status)
    ?.toUpperCase()
    ?.slice(0, width < MIN_WIDTH ? 3 : 200)

  return (
    <View
      onLayout={(e) => {
        setWidth(e.nativeEvent.layout.width)
        // console.log(e.nativeEvent.layout.width)
      }}
      style={[
        styles.container,
        {
          backgroundColor: hasReport ? STATUS_COLOR.REPORTED : color,
          borderColor: color,
          width: '100%'
        },
        style
      ]}
    >
      <Text style={[styles.text]}>{displayText}</Text>
    </View>
  )
}

export default OrderStatus

const styles = StyleSheet.create({
  container: {
    padding: 1,
    borderRadius: 100,
    marginVertical: 0,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center'
  }
})
