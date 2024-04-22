import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useStore } from '../contexts/storeContext'
import { gStyles } from '../styles'
import asDate, { dateFormat } from '../libs/utils-date'

const OrderAssignInfo = ({ orderId }: { orderId: string }) => {
  const { storeSections, orders } = useStore()
  const order = orders.find((o) => o.id === orderId)
  const sectionAssigned = storeSections.find(
    (o) => o?.id === order?.assignToSection
  )?.name
  const assignedDate = order?.scheduledAt
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        {sectionAssigned && (
          <View>
            <Text style={gStyles.h3}>Area</Text>
            <Text style={{ textAlign: 'center' }}>{sectionAssigned}</Text>
          </View>
        )}
        {assignedDate && (
          <View>
            <Text style={gStyles.h3}>Fecha</Text>
            <Text style={{ textAlign: 'center' }}>
              {dateFormat(asDate(assignedDate), 'dd MMM yy HH:mm')}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default OrderAssignInfo

const styles = StyleSheet.create({})
