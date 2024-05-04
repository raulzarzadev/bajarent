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
    <List
      sideButtons={sideButtons}
      preFilteredIds={defaultOrdersIds}
      defaultSortBy="folio"
      defaultOrder="des"
      onPressRow={(id) => {
        // @ts-ignore
        navigate('Orders')
        // @ts-ignore
        navigate('OrderDetails', { orderId: id })
      }}
      sortFields={[
        //{ key: 'priority', label: 'Prioridad' },
        { key: 'note', label: 'Nota' },
        { key: 'folio', label: 'Folio' },
        { key: 'fullName', label: 'Nombre' },
        { key: 'neighborhood', label: 'Colonia' },
        { key: 'status', label: 'Status' },
        { key: 'assignToSection', label: 'Area' },
        { key: 'type', label: 'Tipo' }
      ]}
      data={orders}
      ComponentRow={RowOrder}
      filters={[
        { field: 'assignToSection', label: 'Area' },
        { field: 'type', label: 'Tipo' },
        { field: 'status', label: 'Status' }
      ]}
    />
  )
}

export default ListOrders
