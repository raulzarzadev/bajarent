import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'

import OrderRow from './OrderRow'
import OrderType from '../types/OrderType'
import useSort from '../hooks/useSort'
import { Icon } from 'react-native-elements'

function OrdersList({
  orders,
  onPressRow
}: {
  orders: OrderType[]
  onPressRow?: (orderId: string) => void
}) {
  const { sortBy, order, sortedBy, sortedData } = useSort({ data: orders })

  const sortFields = [
    { key: 'folio', label: 'Folio' },
    { key: 'firstName', label: 'Nombre' },
    // { key: 'lastName', label: 'Apellido' },
    { key: 'assignToPosition', label: 'Asignada' },
    { key: 'createdAt', label: 'Creada' },
    { key: 'scheduledAt', label: 'Programada' },
    { key: 'status', label: 'Estado' }
  ]

  return (
    <View style={styles.container}>
      <View
        style={{
          padding: 16,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          width: '100%'
        }}
      >
        {sortFields.map((field) => (
          <Pressable
            key={field.key}
            onPress={() => {
              sortBy(field.key)
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                fontWeight: sortedBy === field.key ? 'bold' : 'normal'
              }}
            >
              {field.label}
            </Text>
            {sortedBy === field.key && (
              <Icon
                name={order === 'asc' ? 'chevron-up' : 'chevron-down'}
                type="font-awesome"
                size={12}
                color="black"
              />
            )}
          </Pressable>
        ))}
        TSTI
      </View>
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
  )
}

const styles = StyleSheet.create({
  container: {
    // padding: 12,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  orderList: {
    width: '100%',
    // paddingVertical: 40,
    paddingHorizontal: 4
  }
})

export default OrdersList
