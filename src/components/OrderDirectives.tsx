import { StyleSheet, Text, View } from 'react-native'
import OrderStatus from './OrderStatus'
import OrderType, {
  order_status,
  order_type,
  typeOrderIcon
} from '../types/OrderType'
import theme, { ORDER_TYPE_COLOR } from '../theme'
import Chip from './Chip'
import { useStore } from '../contexts/storeContext'
import ErrorBoundary from './ErrorBoundary'
import { currentRentPeriod } from '../libs/orders'
import Icon, { IconName } from './Icon'
import { isToday } from 'date-fns'
import asDate from '../libs/utils-date'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import { useState } from 'react'
import { ServiceCustomers } from '../firebase/ServiceCustomers'
import { CustomerCardE } from './Customers/CustomerCard'
import { OrderContext, OrderProvider } from '../contexts/orderContext'

const OrderDirectives = ({ order }: { order: Partial<OrderType> }) => {
  if (!order) return null
  const { sections: storeSections } = useStore()
  const assignedSectionLabel =
    //@ts-ignore
    order?.assignToSectionName ||
    storeSections?.find(({ id }) => id === order?.assignToSection)?.name ||
    false

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

      <View style={{ width: 50 }}>
        <Chip
          style={[styles.chip, { justifyContent: 'flex-start', padding: 2 }]}
          title={orderType}
          icon={typeOrderIcon(order?.type)}
          color={theme?.transparent}
          titleColor={ORDER_TYPE_COLOR[order?.type]}
          iconSize="sm"
          size="sm"
        ></Chip>
      </View>
      {order.customerId && (
        <ModalCustomerChip customerId={order?.customerId} order={order} />
      )}
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

export const ModalCustomerChip = (
  {
    customerId,
    order
  }: {
    order?: Partial<OrderType>
    customerId: Partial<OrderType['customerId']>
  } = {
    customerId: null,
    order: null
  }
) => {
  const modal = useModal({ title: 'Detalles de cliente' })
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(false)
  return (
    <>
      <Chip
        disabled={loading}
        style={[styles.chip]}
        title={''}
        icon={'customerCard'}
        titleColor={theme?.primary}
        color={theme?.transparent}
        iconSize="sm"
        size="sm"
        onPress={async () => {
          setLoading(true)
          ServiceCustomers.get(customerId).then((res) => {
            setCustomer(res)
            setLoading(false)
            modal.setOpen(true)
          })
        }}
      ></Chip>
      <StyledModal {...modal}>
        <OrderContext.Provider value={{ order: order as OrderType }}>
          <CustomerCardE customer={customer} />
        </OrderContext.Provider>
      </StyledModal>
    </>
  )
}
