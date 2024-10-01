import { StyleSheet, Text, View } from 'react-native'
import OrderStatus from './OrderStatus'
import OrderType, { order_status, order_type } from '../types/OrderType'
import dictionary from '../dictionary'
import theme, { colors } from '../theme'
import Chip from './Chip'
import { useStore } from '../contexts/storeContext'
import ErrorBoundary from './ErrorBoundary'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import InputRadios from './InputRadios'
import { useEffect, useState } from 'react'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { ConsolidatedOrderType } from '../firebase/ServiceConsolidatedOrders'
import { currentRentPeriod } from '../libs/orders'
import { IconName } from './Icon'
import { useOrderDetails } from '../contexts/orderContext'

const OrderDirectives = ({
  order
}: {
  order: Partial<OrderType> | Partial<ConsolidatedOrderType>
}) => {
  if (!order) return null
  const { storeSections } = useStore()
  const assignedSectionLabel =
    order?.assignToSectionName ||
    storeSections.find(({ id }) => id === order?.assignToSection)?.name ||
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
        flexWrap: 'wrap'
      }}
    >
      <View style={{ width: 60 }}>
        <OrderLabels order={order} />
      </View>
      <View style={{ width: 60 }}>
        <Chip
          style={[styles.chip]}
          title={orderType}
          icon={TypeIcon(order?.type)}
          color={theme?.transparent}
          iconSize="sm"
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
    </View>
  )
}

const OrderLabels = ({
  order
}: {
  order: Partial<OrderType> | Partial<ConsolidatedOrderType>
}) => {
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
          color={theme.secondary}
          titleColor={theme.white}
          title={''}
          icon="pickUpIt"
          size="sm"
          iconSize="lg"
        ></Chip>
      )}
      {charge && (
        <Chip
          color={theme.success}
          titleColor={theme.white}
          title={''}
          icon="chargeIt"
          size="sm"
          iconSize="lg"
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
