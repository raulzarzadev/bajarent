import { ScrollView, View } from 'react-native'
import { OrderProvider, useOrderDetails } from '../contexts/orderContext'
import ErrorBoundary from './ErrorBoundary'
import { OrderDetailsE } from './OrderDetails'

const ScreenOrderDetail = () => {
  return (
    <ScrollView>
      <View
        style={{
          maxWidth: 500,
          width: '100%',
          marginHorizontal: 'auto',
          marginTop: 12
        }}
      >
        <OrderProvider>
          <OrderDetailsContext />
        </OrderProvider>
      </View>
    </ScrollView>
  )
}

const OrderDetailsContext = () => {
  const { order } = useOrderDetails()
  return <OrderDetailsE order={order} />
}
export const ScreenOrderDetailE = (props) => (
  <ErrorBoundary componentName="ScreenOrderDetail">
    <ScreenOrderDetail {...props} />
  </ErrorBoundary>
)

export default ScreenOrderDetail
