import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import {
  BalanceItems,
  StoreBalanceOrder,
  StoreBalanceType
} from '../../types/StoreBalance'
import { isWithinInterval } from 'date-fns'
import asDate, { dateFormat } from '../../libs/utils-date'
import { order_status } from '../../types/OrderType'
import { BalanceAmountsE } from '../BalanceAmounts'
import { ExpandibleListE } from '../ExpandibleList'
import { BalanceOrderRowE } from './BalanceOrderRow'
import useMyNav from '../../hooks/useMyNav'
import { gStyles } from '../../styles'
import { useStore } from '../../contexts/storeContext'
const SectionBalanceRents = ({
  orders,
  balance,
  title,
  sectionId = 'all'
}: SectionBalanceRentsProps) => {
  const { toItems, toOrders } = useMyNav()
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

  const solvedReports = balance?.solvedReports
    ?.map((report) =>
      balance.orders.find((order) => order.orderId === report.orderId)
    )
    .filter((order) =>
      sectionId === 'all' ? true : order?.assignedSection === sectionId
    )

  const orderPayment = orders.map((order) => order?.payments).flat()
  const otherPayments = balance.payments.filter((payment) =>
    sectionId === 'all' ? true : payment.sectionId === sectionId
  )
  //* remove duplicates payments
  const payments = [...orderPayment, ...otherPayments].reduce(
    (acc, payment) => {
      if (!acc.find((p) => p.id === payment.id)) {
        acc.push(payment)
      }
      return acc
    },
    []
  )

  //* ITEMS
  //* AVALIABLE ITEMS

  const sortItemsByNumber = (a, b) => a?.itemEco?.localeCompare(b?.itemEco)
  const formatItemsWithSectionAndCategoryName = (item) => ({
    ...item,
    assignedSection: item?.assignedSection || 'withoutSection',
    categoryName:
      item?.categoryName ||
      categories.find(
        //@ts-ignore
        (category) => category.id === item.categoryId
      )?.name
  })

  const availableItems = balance?.items
    .map(formatItemsWithSectionAndCategoryName)
    .flat()
    .filter((item) =>
      sectionId === 'all' ? true : item?.assignedSection === sectionId
    )
    .sort(sortItemsByNumber)

  //* ORDER ITEMS

  const rentedItems = actives
    .map((order) =>
      order?.items?.map((item) => ({
        ...(item || {}),
        orderFolio: order?.orderFolio,
        orderId: order?.orderId
      }))
    )
    .filter(Boolean)
    .flat()
    .map(formatItemsWithSectionAndCategoryName)
    .sort(sortItemsByNumber)

  return (
    <View>
      <Text style={gStyles.h2}>{title}</Text>
      <BalanceAmountsE payments={payments} />

      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
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
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <ExpandibleBalanceOrders orders={actives} label="Todas" />

        <ExpandibleBalanceItemsRented
          items={rentedItems}
          label={'Artículos rentados'}
          defaultExpanded={false}
        />
        <ExpandibleBalanceItemsAvailable
          label={'Artículos disponibles'}
          items={availableItems}
        />
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

export const ExpandibleBalanceItemsAvailable = ({
  items,
  label,
  defaultExpanded
}: {
  items: BalanceItems[]
  label: string
  defaultExpanded?: boolean
}) => {
  const { toItems } = useMyNav()
  const { categories } = useStore()
  return (
    <ExpandibleListE
      label={label}
      defaultExpanded={defaultExpanded}
      items={items.map((item) => {
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
export const ExpandibleBalanceItemsRented = ({
  items,
  label,
  defaultExpanded
}: {
  items: BalanceItems[]
  label: string
  defaultExpanded?: boolean
}) => {
  const { toOrders } = useMyNav()

  return (
    <ExpandibleListE
      label={label}
      defaultExpanded={defaultExpanded}
      items={items.map((item) => {
        return {
          id: item?.orderId,
          content: (
            <Text>
              {item?.itemEco} {item.categoryName} {item.orderFolio}
            </Text>
          )
        }
      })}
      onPressRow={(id) => toOrders?.({ id })}
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
