import { View, ScrollView } from 'react-native'
import OrderDetails from './OrderDetails'
import ErrorBoundary from './ErrorBoundary'
import { OrderProvider, useOrderDetails } from '../contexts/orderContext'
import Loading from './Loading'

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
  if (!order) return <Loading></Loading>
  return <OrderDetails order={order} />
}
export const ScreenOrderDetailE = (props) => (
  <ErrorBoundary componentName="ScreenOrderDetail">
    <ScreenOrderDetail {...props} />
  </ErrorBoundary>
)

export default ScreenOrderDetail
