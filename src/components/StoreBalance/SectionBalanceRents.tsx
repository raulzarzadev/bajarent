import { isWithinInterval } from 'date-fns'
import { Text, View } from 'react-native'
import { useStore } from '../../contexts/storeContext'
import useMyNav from '../../hooks/useMyNav'
import asDate, { dateFormat } from '../../libs/utils-date'
import { gStyles } from '../../styles'
import { order_status } from '../../types/OrderType'
import type {
  BalanceItems,
  StoreBalanceOrder,
  StoreBalanceType
} from '../../types/StoreBalance'
import { BalanceAmountsE } from '../BalanceAmounts'
import ErrorBoundary from '../ErrorBoundary'
import { ExpandibleListE } from '../ExpandibleList'
import { BalanceOrderRowE } from './BalanceOrderRow'

const SectionBalanceRents = ({
  orders = [],
  balance,
  title,
  sectionId = 'all'
}: SectionBalanceRentsProps) => {
  const { categories } = useStore()
  const actives = orders?.filter(
    (order) => order?.orderStatus === order_status.DELIVERED
  )
  const pickedUp = orders?.filter(
    (order) => order?.orderStatus === order_status.PICKED_UP
  )
  const renewed = orders?.filter((order) =>
    isWithinInterval(asDate(order?.renewedAt), {
      start: asDate(balance.fromDate),
      end: asDate(balance.toDate)
    })
  )
  const delivered = orders?.filter((order) =>
    isWithinInterval(asDate(order?.deliveredAt), {
      start: asDate(balance.fromDate),
      end: asDate(balance.toDate)
    })
  )
  const canceled = orders?.filter(
    (order) =>
      order?.orderStatus === order_status.CANCELLED &&
      isWithinInterval(asDate(order?.canceledAt), {
        start: asDate(balance.fromDate),
        end: asDate(balance.toDate)
      })
  )

  const extended = orders?.filter((order) =>
    isWithinInterval(asDate(order?.extendedAt), {
      start: asDate(balance.fromDate),
      end: asDate(balance.toDate)
    })
  )

  const solvedReports = balance?.solvedReports
    ?.map((report) =>
      balance.orders.find((order) => order.orderId === report.orderId)
    )
    .filter((order) =>
      sectionId === 'all' ? true : order?.assignedSection === sectionId
    )

  const orderPayment = orders?.flatMap((order) => order?.payments)

  //* remove duplicates payments
  const payments = orderPayment.reduce((acc, payment) => {
    if (!acc.find((p) => p.id === payment.id)) {
      acc.push(payment)
    }
    return acc
  }, [])

  const sectionPayments = balance.payments.filter(
    (p) => p.type && (sectionId === 'all' || p.sectionId === sectionId)
  )

  //* ITEMS
  //* AVALIABLE ITEMS

  const sortItemsByNumber = (a, b) => a?.itemEco?.localeCompare(b?.itemEco)
  const formatItemsWithSectionAndCategoryName = (item) => ({
    ...item,
    assignedSection: item?.assignedSection || 'withoutSection',
    categoryName:
      item?.categoryName ||
      categories.find((category) => category.id === item.categoryId)?.name
  })

  const availableItems = balance?.items
    .flatMap(formatItemsWithSectionAndCategoryName)
    .filter((item) =>
      sectionId === 'all' ? true : item?.assignedSection === sectionId
    )
    .filter((item) => item?.status !== 'rented') //* keep out rented items (they are in the orders )
    .sort(sortItemsByNumber)

  //* ORDER ITEMS

  return (
    <View>
      <Text style={gStyles.h2}>{title}</Text>
      <BalanceAmountsE payments={[...payments, ...sectionPayments]} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <ExpandibleBalanceItems
          items={availableItems}
          label="Artículos disponibles"
          defaultExpanded
          hideIfEmpty={false}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap'
        }}
      >
        <ExpandibleBalanceOrders
          orders={delivered}
          label="Rentas"
          defaultExpanded
        />
        <ExpandibleBalanceOrders
          orders={renewed}
          label="Renovadas"
          defaultExpanded
        />
        <ExpandibleBalanceOrders
          orders={pickedUp}
          label="Recogidas"
          defaultExpanded
        />
        <ExpandibleBalanceOrders
          orders={extended}
          label="Extendidas"
          defaultExpanded
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <ExpandibleBalanceOrders orders={actives} label="Rentas activas" />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <ExpandibleBalanceOrders orders={canceled} label="Canceladas" />
        <ExpandibleBalanceOrders
          orders={solvedReports}
          label="Reportes resueltos"
        />
      </View>
    </View>
  )
}

export const ExpandibleBalanceOrders = ({
  orders,
  label,
  defaultExpanded
}: {
  orders: StoreBalanceOrder[]
  label: string
  defaultExpanded?: boolean
}) => {
  const { toOrders } = useMyNav()
  if (!orders.length) return null
  return (
    <ExpandibleListE
      label={label}
      defaultExpanded={defaultExpanded}
      items={orders.map((order) => ({
        id: order?.orderId,
        content: <BalanceOrderRowE order={order} />
      }))}
      onPressRow={(id) => toOrders({ id })}
    />
  )
}

export const ExpandibleBalanceItems = ({
  items,
  label,
  defaultExpanded,
  hideIfEmpty = true
}: {
  items: BalanceItems[]
  label: string
  defaultExpanded?: boolean
  hideIfEmpty?: boolean
}) => {
  const { toItems } = useMyNav()
  const { categories } = useStore()
  const sortByEco = (a, b) => a?.itemEco?.localeCompare(b?.itemEco)
  if (!items.length && hideIfEmpty) return null
  return (
    <ExpandibleListE
      label={label}
      onPressTitle={() => {
        toItems?.({ ids: items.map((item) => item.itemId) })
      }}
      defaultExpanded={defaultExpanded}
      items={items.sort(sortByEco).map((item) => {
        return {
          id: item?.itemId,
          content: (
            <Text>
              {item?.itemEco}{' '}
              {item.categoryName ||
                categories.find((cat) => cat.id === item?.categoryId)?.name}
            </Text>
          )
        }
      })}
      onPressRow={(id) => toItems?.({ id })}
    />
  )
}

export type SectionBalanceRentsProps = {
  orders: StoreBalanceOrder[]
  balance: StoreBalanceType
  title: string
  sectionId: string
}
export const SectionBalanceRentsE = (props: SectionBalanceRentsProps) => (
  <ErrorBoundary componentName="SectionBalanceRents">
    <SectionBalanceRents {...props} />
  </ErrorBoundary>
)
export default SectionBalanceRents
