import { StyleSheet, Text, View } from 'react-native'
import OrderStatus from './OrderStatus'
import OrderType, { IconOrderType } from '../types/OrderType'
import dictionary from '../dictionary'
import theme from '../theme'
import Chip from './Chip'
import { useStore } from '../contexts/storeContext'
import ErrorBoundary from './ErrorBoundary'
import Icon from './Icon'

const OrderDirectives = ({ order }: { order: Partial<OrderType> }) => {
  const { storeSections } = useStore()
  const sectionName = storeSections?.find(
    ({ id }) => id === order?.assignToSection
  )?.name
  const ICON = IconOrderType[order?.type]
  return (
    <View
      style={{
        flexDirection: 'row',
        // //  justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}
    >
      {ICON ? <Text>{ICON}</Text> : null}
      <Chip
        style={[styles.chip, { marginLeft: 6 }]}
        title={`${dictionary(order?.type)?.toUpperCase()}`}
        color={theme?.info}
        titleColor={theme.black}
        size="sm"
      ></Chip>
      {!!sectionName && (
        <Chip
          style={styles.chip}
          title={sectionName}
          color={theme?.base}
          titleColor={theme.secondary}
          size="sm"
        ></Chip>
      )}
      <OrderStatus order={order} chipStyles={styles.chip} chipSize={'sm'} />

      {/* <OrderAssignedTo
        orderId={order?.id}
        chipStyles={styles.chip}
        chipSize={'sm'}
      /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  chip: {
    margin: 2,
    maxWidth: 105
  }
})

export const OrderDirectivesE = (props) => (
  <ErrorBoundary componentName="OrderDirectives">
    <OrderDirectives {...props} />
  </ErrorBoundary>
)

export default OrderDirectives
