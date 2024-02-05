import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useStore } from '../contexts/storeContext'

const OrderAssignedTo = ({ orderId }) => {
  const { orders, storeSections, staff } = useStore()
  const order = orders?.find((o) => o?.id === orderId)
  const assignToSection =
    order?.assignToSection &&
    storeSections.find((s) => s.id === order.assignToSection)?.name
  const assignToName =
    order?.assignTo && staff.find((s) => s.id === order.assignTo)?.name
  return (
    <View style={styles.container}>
      {assignToSection || assignToName ? (
        <Text style={styles.item}>Asignado a:</Text>
      ) : (
        <Text>Sin asingar</Text>
      )}
      {assignToSection && (
        <Text style={styles.item}>Area: {assignToSection}</Text>
      )}
      {assignToName && <Text style={styles.item}>Staff: {assignToName}</Text>}
    </View>
  )
}

export default OrderAssignedTo

const styles = StyleSheet.create({
  container: {},
  item: {
    width: '48%', // for 2 items in a row
    marginVertical: '1%', // spacing between items
    textAlign: 'center',
    marginHorizontal: 'auto'
  }
})
