import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native'
import React from 'react'
import { useStore } from '../contexts/storeContext'
import { StaffRow } from './ScreenStaff'
import { ServiceOrders } from '../firebase/ServiceOrders'
import Button from './Button'

const ScreenAssignOrder = ({ route, navigation }) => {
  const { orderId } = route.params
  const { orders, staff } = useStore()
  const order = orders.find(({ id }) => id === orderId)
  if (!order) return <ActivityIndicator />
  const handleAssignOrder = (staffId: string) => {
    ServiceOrders.update(orderId, { assignTo: staffId })
      .then(() => {
        navigation.navigate('OrderDetails', { orderId })
      })
      .catch(console.error)
  }
  const assignTo = order.assignTo || ''
  console.log({ assignTo, staff })
  return (
    <View>
      <Text>
        Orden asignada a: {staff.find((s) => s.id === assignTo)?.name}{' '}
        {staff.find((s) => s.id === assignTo)?.position}
      </Text>
      {assignTo && (
        <Button
          onPress={() => {
            handleAssignOrder('')
          }}
          label="No asignar"
        ></Button>
      )}
      <FlatList
        data={staff}
        renderItem={({ item }) => (
          <StaffRow
            staff={item}
            onPress={() => {
              handleAssignOrder(item.id)
            }}
          />
        )}
        keyExtractor={({ id }) => id}
      />
    </View>
  )
}

export default ScreenAssignOrder

const styles = StyleSheet.create({})
