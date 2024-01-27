import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FormOrder from './FormOrder'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useStore } from '../contexts/storeContext'
import OrderType from '../types/OrderType'

const ScreenNewOrder = ({ navigation }) => {
  const { storeId } = useStore()
  const handleSubmit = async (values: OrderType) => {
    return await ServiceOrders.create({ storeId, ...values })
      .then((res) => {
        const orderId = res?.res?.id
        console.log({ res })
        navigation.push('OrderDetails', { orderId: orderId })
        // alert('Orden creada')
      })
      .catch(console.error)
  }
  return <FormOrder onSubmit={handleSubmit} />
}

export default ScreenNewOrder

const styles = StyleSheet.create({})
