import React from 'react'
import { ListSideButton, LoadingList } from './List'
import { useNavigation } from '@react-navigation/native'
import { RowOrderE } from './RowOrder'
import OrderType from '../types/OrderType'
import MultiOrderActions from './OrderActions/MultiOrderActions'
import { useStore } from '../contexts/storeContext'
import { CollectionSearch } from '../hooks/useFilter'
import ErrorBoundary from './ErrorBoundary'
export type ListOrderProps = {
  orders: OrderType[]
  defaultOrdersIds?: string[]
  sideButtons?: ListSideButton[]
  collectionSearch?: CollectionSearch
}
const ListOrders = ({
  orders,
  defaultOrdersIds,
  sideButtons = [],
  collectionSearch
}: ListOrderProps) => {
  const { navigate } = useNavigation()
  const { storeSections } = useStore()
  const formatOrders = orders
    ?.map((o) => {
      const assignedToSection =
        storeSections?.find((section) => section?.id === o?.assignToSection)
          ?.name || null

      const order = {
        id: o?.id,
        ...o,
        assignToSectionName: assignedToSection
        //  assignedToSection
      }
      return o?.id ? order : null
    })
    ?.filter((order) => !!order)

  return (
    <LoadingList
      data={formatOrders}
      pinRows={true}
      sideButtons={sideButtons}
      preFilteredIds={defaultOrdersIds}
      defaultSortBy="folio"
      defaultOrder="des"
      onPressRow={(id) => {
        //@ts-ignore
        navigate('StackOrders', {
          screen: 'OrderDetails',
          params: { orderId: id }
        })
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
        { key: 'expireAt', label: 'Vencimiento' },
        { key: 'colorLabel', label: 'Color' }
      ]}
      ComponentRow={({ item }) => <RowOrderE item={item} />}
      filters={[
        { field: 'assignToSection', label: 'Area' },
        { field: 'type', label: 'Tipo' },
        { field: 'status', label: 'Status' },

        { field: 'colorLabel', label: 'Color' },
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
        // {
        //   field: 'createdAt',
        //   label: 'Creación',
        //   isDate: true
        // },
        // {
        //   field: 'expireAt',
        //   label: 'Vencimiento',
        //   isDate: true
        // },
        // {
        //   field: 'deliveredAt',
        //   label: 'Entrega',
        //   isDate: true
        // },
        // {
        //   field: 'pickedUpAt',
        //   label: 'Fecha de recolección',
        //   isDate: true
        // }
      ]}
      ComponentMultiActions={({ ids }) => {
        return <MultiOrderActions ordersIds={ids} data={formatOrders} />
      }}
      collectionSearch={collectionSearch}
    />
  )
}

export const ListOrdersE = (props: ListOrderProps) => (
  <ErrorBoundary componentName="ListOrders">
    <ListOrders {...props} />
  </ErrorBoundary>
)

export default ListOrders
