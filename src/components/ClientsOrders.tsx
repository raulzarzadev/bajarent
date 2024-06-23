import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useStore } from '../contexts/storeContext'
import ListOrders from './ListOrders'

const ClientsOrders = ({ clientId }) => {
  const [orders, setOrders] = React.useState([])
  const { storeId } = useStore()
  React.useEffect(() => {
    ServiceOrders.getClientOrders({ clientId, storeId }).then((res) => {
      console.log({ res })
      setOrders(res)
    })
  }, [clientId])

  return (
    <View>
      <ListOrders orders={orders} />
    </View>
  )
}

export default ClientsOrders

const styles = StyleSheet.create({})
