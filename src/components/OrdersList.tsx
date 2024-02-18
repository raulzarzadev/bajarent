import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import OrderRow from './OrderRow'
import OrderType from '../types/OrderType'
import useSort from '../hooks/useSort'

import ModalFilterOrders from './ModalFilterOrders'
import { useState } from 'react'
import Icon from './Icon'
import Button from './Button'
import { useNavigation } from '@react-navigation/native'
import { useStore } from '../contexts/storeContext'
import { gSpace } from '../styles'

function OrdersList({
  orders,
  onPressRow
}: {
  orders: OrderType[]
  onPressRow?: (orderId: string) => void
}) {
  const { staffPermissions } = useStore()
  const navigation = useNavigation()

  const [filteredData, setFilteredData] = useState<OrderType[]>([])

  const { sortBy, order, sortedBy, sortedData } = useSort<OrderType>({
    data: filteredData,
    defaultSortBy: 'priority',
    defaultOrder: 'des'
  })

  const sortFields = [
    { key: 'priority', label: 'Prioridad' },
    { key: 'folio', label: 'Folio' },
    { key: 'firstName', label: 'Nombre' },
    // { key: 'type', label: 'Tipo' },
    { key: 'neighborhood', label: 'Colonia' },
    { key: 'status', label: 'Status' },
    { key: 'assignToSection', label: 'Area' }
    // { key: 'lastName', label: 'Apellido' },
    // { key: 'assignToStaff', label: 'Staff' },
    // { key: 'createdAt', label: 'Creada' },
    // { key: 'scheduledAt', label: 'Programada' },
  ]

  return (
    <>
      <View style={styles.container}>
        {/* *** FILTERS FIELDS */}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            maxWidth: 500,
            padding: 4
          }}
        >
          {(staffPermissions?.canCreateOrder || staffPermissions.isAdmin) && (
            <Button
              label="Nueva"
              icon="add"
              onPress={() => {
                // @ts-ignore

                navigation.navigate('Orders', { screen: 'NewOrder' })
              }}
              size="xs"
            ></Button>
          )}

          <ModalFilterOrders orders={orders} setOrders={setFilteredData} />
        </View>
        <View>
          <Text style={{ textAlign: 'center' }}>
            {filteredData.length} ordenes
          </Text>
        </View>
        <View
          style={{
            padding: 4,
            justifyContent: 'center',
            marginTop: gSpace(2),
            maxWidth: '100%'
          }}
        >
          {/* *** SORT FIELDS */}
          <FlatList
            horizontal
            data={sortFields}
            renderItem={({ item: field }) => (
              <View key={field.key}>
                <Pressable
                  onPress={() => {
                    sortBy(field.key)
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    margin: 4,
                    width: 65
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      fontWeight: sortedBy === field.key ? 'bold' : 'normal'
                    }}
                  >
                    {field.label}
                  </Text>
                  {sortedBy === field.key && (
                    <Icon icon={order === 'asc' ? 'up' : 'down'} size={12} />
                  )}
                </Pressable>
              </View>
            )}
          />
        </View>
        {/* *** ROWS */}

        <FlatList
          style={styles.orderList}
          data={sortedData}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                onPressRow && onPressRow(item.id)
              }}
            >
              <OrderRow order={item} />
            </Pressable>
          )}
        ></FlatList>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    // padding: 12,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    margin: 'auto',
    width: '100%'
  },
  orderList: {
    width: '100%',
    // paddingVertical: 40,
    paddingHorizontal: 4
  }
})

export default OrdersList
