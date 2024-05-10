import { StyleSheet, View } from 'react-native'
import OrderStatus from './OrderStatus'
import OrderType from '../types/OrderType'
import dictionary from '../dictionary'
import theme from '../theme'
import Chip from './Chip'
import { useStore } from '../contexts/storeContext'
import ErrorBoundary from './ErrorBoundary'

const OrderDirectives = ({ order }: { order: Partial<OrderType> }) => {
  const { storeSections } = useStore()
  const sectionName = storeSections?.find(
    ({ id }) => id === order?.assignToSection
  )?.name
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}
    >
      <Chip
        style={styles.chip}
        title={dictionary(order?.type)?.toUpperCase()}
        color={theme?.info}
        titleColor={theme.black}
        size="sm"
      ></Chip>
      <OrderStatus order={order} chipStyles={styles.chip} chipSize={'sm'} />
      {!!sectionName && (
        <Chip
          style={styles.chip}
          title={sectionName}
          color={theme?.primary}
          titleColor={theme.black}
          size="sm"
        ></Chip>
      )}
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
