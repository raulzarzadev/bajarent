import { StyleSheet, View } from 'react-native'
import React from 'react'
import { STATUS_COLOR } from '../theme'
import dictionary from '../dictionary'
import P from './P'
import { useStore } from '../contexts/storeContext'

const OrderStatus = ({ orderId }: { orderId?: string }) => {
  const { orders } = useStore()
  const order = orders.find((order) => order.id === orderId)
  const status = order?.status
  const color = STATUS_COLOR[order?.status]
  const hasReport = order?.hasNotSolvedReports

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: hasReport ? STATUS_COLOR.REPORTED : color,
          borderColor: color
        }
      ]}
    >
      <P styles={styles.text}>
        {dictionary(status || 'PENDING').toUpperCase()}
      </P>
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

    width: 150
  },
  text: {
    fontWeight: 'bold'
  }
})
