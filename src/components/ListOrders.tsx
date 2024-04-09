import { StyleSheet, View } from 'react-native'
import React from 'react'
import List, { ListSideButton } from './List'
import { useNavigation } from '@react-navigation/native'
import RowOrder from './RowOrder'
import OrderType from '../types/OrderType'

const ListOrders = ({
  orders,
  defaultOrdersIds,
  sideButtons = []
}: {
  orders: OrderType[]
  defaultOrdersIds?: string[]
  sideButtons?: ListSideButton[]
}) => {
  const { navigate } = useNavigation()
  return (
    <View style={{ margin: 'auto' }}>
      <List
        sideButtons={sideButtons}
        preFilteredIds={defaultOrdersIds}
        defaultSortBy="folio"
        defaultOrder="des"
        onPressRow={(id) => {
          // @ts-ignore
          // navigate('OrdersDetails', { orderId: id })
          navigate('Orders')
          // @ts-ignore
          navigate('OrderDetails', { orderId: id })
        }}
        onPressNew={() => {
          // @ts-ignore
          navigate('NewOrder')
        }}
        sortFields={[
          { key: 'priority', label: 'Prioridad' },
          { key: 'folio', label: 'Folio' },
          { key: 'fullName', label: 'Nombre' },
          { key: 'neighborhood', label: 'Colonia' },
          { key: 'status', label: 'Status' },
          { key: 'assignToSection', label: 'Area' },
          { key: 'type', label: 'Tipo' }
          // {
          //   key: 'createdAt',
          //   label: 'Fecha'
          // },
          // {
          //   key: 'fromDate',
          //   label: 'Desde'
          // },
          // {
          //   key: 'toDate',
          //   label: 'Hasta'
          // },
          // {

          // {
          //   key: 'userId',
          //   label: 'Usuario'
          // }
        ]}
        data={orders}
        ComponentRow={RowOrder}
        filters={[
          { field: 'type', label: 'Tipo' },
          { field: 'status', label: 'Status' },
          { field: 'assignToSection', label: 'Area' }
        ]}
      />
    </View>
  )
}

export default ListOrders

const styles = StyleSheet.create({})
