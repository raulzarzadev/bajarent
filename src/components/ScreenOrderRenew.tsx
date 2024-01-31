import { ActivityIndicator } from 'react-native'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useStore } from '../contexts/storeContext'
import FormOrder from './FormOrder'
import { order_status } from '../types/OrderType'
import { useNavigation } from '@react-navigation/native'

const ScreenOrderRenew = ({ route }) => {
  const orderId = route?.params?.orderId
  const { navigate } = useNavigation()
  const { orders } = useStore()
  const order = orders.find((o) => o.id === orderId)
  if (!order) return <ActivityIndicator />

  return (
    <FormOrder
      defaultValues={order}
      onSubmit={async (order) => {
        ServiceOrders.update(orderId, {
          status: order_status.RENEWED
        })
        //   .then(console.log)
        //   .catch(console.error)
        const renewedOrder = {
          ...order,
          status: order_status.DELIVERED,
          deliveredAt: order.expireAt,
          renewedAt: new Date(),
          renewedFrom: orderId
        }

        delete renewedOrder.id
        delete renewedOrder.createdAt
        delete renewedOrder.updatedAt
        delete renewedOrder.scheduledAt
        delete renewedOrder.createdBy
        delete renewedOrder.updatedBy
        delete renewedOrder.comments
        delete renewedOrder.assignToPosition
        delete renewedOrder.assignToName
        delete renewedOrder.expireAt

        await ServiceOrders.create(renewedOrder)
          .then((res) => {
            if (res.ok)
              ServiceOrders.addComment({
                storeId: order.storeId,
                orderId,
                type: 'comment',
                content: 'Orden renovada '
              })
                .then(() => {
                  // @ts-ignore
                  navigate('OrderDetails', { orderId: res.res.id || '' })
                })
                .catch(console.error)
          })
          .catch(console.error)
      }}
    />
  )
}

export default ScreenOrderRenew
