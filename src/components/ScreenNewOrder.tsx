import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FormOrder from './FormOrder'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useStore } from '../contexts/storeContext'
import OrderType from '../types/OrderType'

const ScreenNewOrder = () => {
  const { storeId } = useStore()
  const handleSubmit = async (values: OrderType) => {
    return await ServiceOrders.create({ storeId, ...values })
      .then(() => {
        alert('Orden creada')
      })
      .catch(console.error)
  }
  return (
    <View>
      <FormOrder onSubmit={handleSubmit} />
    </View>
  )
}

export default ScreenNewOrder

const styles = StyleSheet.create({})
