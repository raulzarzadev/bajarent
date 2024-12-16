import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { StoreBalanceOrder, StoreBalanceType } from '../../types/StoreBalance'
import { isWithinInterval } from 'date-fns'
import asDate, { dateFormat } from '../../libs/utils-date'
import { order_status } from '../../types/OrderType'
import { BalanceAmountsE } from '../BalanceAmounts'
import { ExpandibleListE } from '../ExpandibleList'
import { BalanceOrderRowE } from './BalanceOrderRow'
import useMyNav from '../../hooks/useMyNav'
import { gStyles } from '../../styles'
const SectionBalanceRents = ({
  orders,
  balance,
  title,
  items
}: SectionBalanceRentsProps) => {
  const { toItems } = useMyNav()
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

  const payments = orders.map((order) => order?.payments).flat()

  return (
    <View>
      <Text style={gStyles.h2}>{title}</Text>
      <BalanceAmountsE payments={payments} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <ExpandibleListE
          label={'Artículos'}
          defaultExpanded={false}
          items={items?.map((item) => {
            return {
              id: item?.itemId,
              content: <Text>{item?.itemEco}</Text>
            }
          })}
          onPressRow={(id) => toItems({ id })}
        />
      </View>
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
        <ExpandibleBalanceOrders orders={canceled} label="Canceladas" />
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
        id: order.orderId,
        content: <BalanceOrderRowE order={order} />
      }))}
      onPressRow={(id) => toOrders({ id })}
    />
  )
}
export type SectionBalanceRentsProps = {
  orders: StoreBalanceOrder[]
  balance: StoreBalanceType
  title: string
  items: StoreBalanceType['items']
}
export const SectionBalanceRentsE = (props: SectionBalanceRentsProps) => (
  <ErrorBoundary componentName="SectionBalanceRents">
    <SectionBalanceRents {...props} />
  </ErrorBoundary>
)
export default SectionBalanceRents
