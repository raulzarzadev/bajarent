import React from 'react'
import { ListSideButton, LoadingList } from './List'
import { useNavigation } from '@react-navigation/native'
import { RowOrderE, RowOrderType } from './RowOrder'
import OrderType, { order_status } from '../types/OrderType'
import MultiOrderActions from './OrderActions/MultiOrderActions'
import { useStore } from '../contexts/storeContext'
import { CollectionSearch } from '../hooks/useFilter'
import ErrorBoundary from './ErrorBoundary'
import theme from '../theme'

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

      const order: RowOrderType = {
        id: o?.id,
        ...o,
        assignToSectionName: assignedToSection,
        hasImportantComment: o?.comments?.some(
          (c) => c.type === 'important' && !c.solved
        ),
        //* Show a list of items numbers
        //* if has more tha one show count and list
        //* else show only the number
        itemsString: `${
          o?.items?.length > 1 ? `(${o?.items?.length || 0}) ` : ''
        }${o?.items?.map((i) => i?.number)?.join(', ') || ''}`,
        itemsNumbers: o?.items
          ?.map((i) => i?.number)
          .sort((a, b) => a.localeCompare(b))
          .join(', '),
        isAuthorized: o?.status === order_status.AUTHORIZED
        //  assignedToSection
      }
      return o?.id ? order : null
    })
    ?.filter((order) => !!order)

  return (
    <>
      <LoadingList
        ComponentRow={({ item }) => <RowOrderE item={item} />}
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
          { key: 'colorLabel', label: 'Color' },
          { key: 'itemsNumbers', label: 'Item' }
        ]}
        filters={[
          { field: 'assignToSection', label: 'Area' },
          { field: 'type', label: 'Tipo' },
          { field: 'status', label: 'Status' },

          { field: 'colorLabel', label: 'Color' },

          //* Boolean filters
          {
            field: 'isAuthorized',
            label: 'Pedido',
            boolean: true,
            icon: 'calendar',
            color: theme.warning,
            titleColor: theme.accent
          },
          {
            field: 'hasNotSolvedReports',
            label: 'Reportes ',
            boolean: true,
            icon: 'report',
            color: theme.error,
            titleColor: theme.white
          },

          {
            field: 'isExpired',
            label: 'Vencidas ',
            boolean: true,
            icon: 'alarmOff',
            color: theme.success,
            titleColor: theme.white
          },
          {
            field: 'hasImportantComment',
            label: 'Importante',
            boolean: true,
            icon: 'warning',
            color: theme.warning,
            titleColor: theme.accent
          },
          {
            field: 'expiresTomorrow',
            label: 'Vence mañana ',
            boolean: true,
            icon: 'alarm',
            color: theme.warning,
            titleColor: theme.accent
          }
        ]}
        ComponentMultiActions={({ ids }) => {
          return <MultiOrderActions ordersIds={ids} data={formatOrders} />
        }}
        collectionSearch={collectionSearch}
      />
    </>
  )
}

export const ListOrdersE = (props: ListOrderProps) => (
  <ErrorBoundary componentName="ListOrders">
    <ListOrders {...props} />
  </ErrorBoundary>
)

export default ListOrders
