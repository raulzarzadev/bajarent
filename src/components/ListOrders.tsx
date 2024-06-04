import React from 'react'
import { ListSideButton, LoadingList } from './List'
import { useNavigation } from '@react-navigation/native'
import RowOrder from './RowOrder'
import OrderType from '../types/OrderType'
import MultiOrderActions from './OrderActions/MultiOrderActions'

const ListOrders = ({
  orders,
  defaultOrdersIds,
  sideButtons = [],
  collectionSearch,
  showTime,
  showTotal
}: {
  orders: OrderType[]
  defaultOrdersIds?: string[]
  sideButtons?: ListSideButton[]
  collectionSearch?: {
    collectionName: string
    fields: string[]
  }
  showTime?: boolean
  showTotal?: boolean
}) => {
  const { navigate } = useNavigation()
  return (
    <LoadingList
      listType="orders"
      sideButtons={sideButtons}
      preFilteredIds={defaultOrdersIds}
      defaultSortBy="folio"
      defaultOrder="des"
      onPressRow={(id) => {
        //@ts-ignore
        navigate('OrderDetails', { orderId: id })
        //@ts-ignore
        //  navigate('OrderDetails', { orderId: id })
      }}
      sortFields={[
        //{ key: 'priority', label: 'Prioridad' },
        { key: 'folio', label: 'Folio' },
        { key: 'note', label: 'Contrato' },
        { key: 'fullName', label: 'Nombre' },
        { key: 'neighborhood', label: 'Colonia' },
        { key: 'status', label: 'Status' },
        { key: 'assignToSection', label: 'Area' },
        { key: 'type', label: 'Tipo' },
        { key: 'expireAt', label: 'Vencimiento' }
      ]}
      data={orders}
      ComponentRow={({ item }) => (
        <RowOrder item={item} showTime={showTime} showTotal={showTotal} />
      )}
      filters={[
        { field: 'assignToSection', label: 'Area' },
        { field: 'type', label: 'Tipo' },
        { field: 'status', label: 'Status' },
        {
          field: 'hasNotSolvedReports',
          label: 'Reportes ',
          boolean: true
        },

        {
          field: 'isExpired',
          label: 'Vencidas ',
          boolean: true
        },
        {
          field: 'expiresTomorrow',
          label: 'Vence mañana ',
          boolean: true
        }
      ]}
      ComponentMultiActions={({ ids }) => {
        return <MultiOrderActions ordersIds={ids} />
      }}
      collectionSearch={collectionSearch}
    />
  )
}

export default ListOrders
