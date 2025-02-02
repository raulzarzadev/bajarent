import { StyleSheet, Text, View } from 'react-native'
import OrderStatus from './OrderStatus'
import OrderType, { order_status, order_type } from '../types/OrderType'
import theme from '../theme'
import Chip from './Chip'
import { useStore } from '../contexts/storeContext'
import ErrorBoundary from './ErrorBoundary'
import { currentRentPeriod } from '../libs/orders'
import Icon, { IconName } from './Icon'
import { isToday } from 'date-fns'
import asDate from '../libs/utils-date'

const OrderDirectives = ({ order }: { order: Partial<OrderType> }) => {
  if (!order) return null
  const { sections: storeSections } = useStore()
  const assignedSectionLabel =
    //@ts-ignore
    order?.assignToSectionName ||
    storeSections?.find(({ id }) => id === order?.assignToSection)?.name ||
    false
  const TypeIcon = (type: OrderType['type']): IconName => {
    if (type === order_type.RENT) {
      return 'rent'
    }
    if (type === order_type.SALE) {
      return 'sale'
    }
    if (type === order_type.REPAIR) {
      return 'wrench'
    }
  }

  const orderType = `${currentRentPeriod(order, {
    shortLabel: true
  })}`

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        position: 'relative'
      }}
    >
      <View
        style={{ position: 'absolute', top: 4, right: 4, flexDirection: 'row' }}
      >
        {order?.sentMessages?.some((m) => isToday(asDate(m?.sentAt))) && (
          <View style={{ margin: 1 }}>
            <Icon icon="whatsapp" size={12} color={theme.success} />
          </View>
        )}
        {order.marketOrder && (
          <View style={{ margin: 1 }}>
            <Icon icon="www" size={12} />
          </View>
        )}
      </View>
      {/* <View style={{ width: 60 }}>
        <OrderLabels order={order} />
      </View> */}
      <View style={{ width: 40 }}>
        <Chip
          style={[styles.chip]}
          title={orderType}
          icon={TypeIcon(order?.type)}
          color={theme?.transparent}
          iconSize="sm"
          size="sm"
        ></Chip>
      </View>
      <OrderStatus order={order} chipStyles={styles.chip} chipSize={'sm'} />

      {!!assignedSectionLabel && (
        <Chip
          style={styles.chip}
          title={assignedSectionLabel}
          color={theme?.base}
          titleColor={theme.secondary}
          size="sm"
        ></Chip>
      )}
      <OrderLabels order={order} />
    </View>
  )
}

const OrderLabels = ({ order }: { order: Partial<OrderType> }) => {
  const collect = order?.markedToCollect
  const charge = order?.markedToCharge
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around'
      }}
    >
      {collect && !(order.status === order_status.PICKED_UP) && (
        <Chip
          style={{ margin: 2 }}
          color={theme.secondary}
          titleColor={theme.white}
          title={''}
          icon="pickUpIt"
          size="sm"
          iconSize="sm"
        ></Chip>
      )}
      {charge && (
        <Chip
          style={{ margin: 2 }}
          color={theme.success}
          titleColor={theme.white}
          title={''}
          icon="chargeIt"
          size="sm"
          iconSize="sm"
        ></Chip>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  chip: {
    margin: 2,
    maxWidth: 120
  }
})

export const OrderDirectivesE = (props) => (
  <ErrorBoundary componentName="OrderDirectives">
    <OrderDirectives {...props} />
  </ErrorBoundary>
)

export default OrderDirectives
