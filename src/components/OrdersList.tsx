import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import OrderRow from './OrderRow'
import OrderType from '../types/OrderType'
import useSort from '../hooks/useSort'

import useFilter from '../hooks/useFilter'
import InputTextStyled from './InputTextStyled'
import ModalFilterOrders from './ModalFilterOrders'
import { useState } from 'react'
import Icon from './Icon'

function OrdersList({
  orders,
  onPressRow
}: {
  orders: OrderType[]
  onPressRow?: (orderId: string) => void
}) {
  const [filteredData, setFilteredData] = useState([])

  const { filteredData: fromSearchData, search } = useFilter({
    data: filteredData
  })
  const { sortBy, order, sortedBy, sortedData } = useSort({
    data: fromSearchData,
    defaultSortBy: 'folio'
  })

  const sortFields = [
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

  let timerId = null
  const handleDebounceSearch = (e: string) => {
    if (timerId) {
      clearTimeout(timerId)
    }

    timerId = setTimeout(() => {
      search(e)
    }, 300)
  }

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <InputTextStyled
            placeholder="Buscar..."
            onChangeText={(e) => {
              handleDebounceSearch(e)
            }}
          />
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
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            width: '100%',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          {sortFields.map((field) => (
            <View key={field.key}>
              <Pressable
                onPress={() => {
                  sortBy(field.key)
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  margin: 4,
                  width: 100
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
                  <Icon icon={order === 'asc' ? 'up' : 'down'} size={12} />
                )}
              </Pressable>
            </View>
          ))}
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
    </>
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
