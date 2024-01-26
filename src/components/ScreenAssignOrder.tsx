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
import P from './P'
import CardStaff from './CardStaff'
import H1 from './H1'

const ScreenAssignOrder = ({ route, navigation }) => {
  const { orderId } = route.params
  const { orders, staff } = useStore()
  const order = orders.find(({ id }) => id === orderId)
  if (!order) return <ActivityIndicator />
  const handleAssignOrder = (staffId: string) => {
    ServiceOrders.update(orderId, { assignTo: staffId })
      .then(() => {
        // navigation.navigate('OrderDetails', { orderId })
      })
      .catch(console.error)
  }
  const assignTo = order.assignTo || ''
  return (
    <View
      style={{
        maxWidth: 400,
        margin: 'auto',
        paddingVertical: 16,
        width: '100%'
      }}
    >
      <View
        style={{
          marginBottom: 16
        }}
      >
        {!!assignTo ? (
          <>
            <Text>Orden asignada a: </Text>
            <CardStaff staff={staff.find((s) => s?.id === assignTo)} />
          </>
        ) : (
          <H1>Asignar orden</H1>
        )}
      </View>
      {!!assignTo && (
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
          <>
            {assignTo !== item.id ? (
              <StaffRow
                staff={item}
                onPress={() => {
                  handleAssignOrder(item.id)
                }}
                fields={['name', 'position', 'phone']}
              />
            ) : null}
          </>
        )}
        keyExtractor={({ id }) => id}
      />
    </View>
  )
}

export default ScreenAssignOrder

const styles = StyleSheet.create({})
