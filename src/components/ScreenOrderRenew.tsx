import { ActivityIndicator } from 'react-native'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useStore } from '../contexts/storeContext'
import FormOrder from './FormOrder'
import OrderType, { order_status } from '../types/OrderType'
import { useNavigation } from '@react-navigation/native'

const ScreenOrderRenew = ({ route }) => {
  const orderId = route?.params?.orderId
  const { navigate } = useNavigation()
  const { orders } = useStore()
  const originalOrder = orders.find((o) => o.id === orderId)

  const newOrder: Partial<OrderType> = {
    storeId: originalOrder?.storeId || '',
    assignToSection: originalOrder?.assignToSection || '',
    assignToStaff: originalOrder?.assignToStaff || '',
    neighborhood: originalOrder?.neighborhood || '',
    phone: originalOrder?.phone,
    status: order_status.DELIVERED,
    type: originalOrder?.type,
    firstName: originalOrder?.firstName || '',
    lastName: originalOrder?.lastName || '',
    fullName: originalOrder?.fullName || '',
    address: originalOrder?.address || '',
    betweenStreets: originalOrder?.betweenStreets || '',
    location: originalOrder?.location || '',
    email: originalOrder?.email || '',
    description: originalOrder?.description || '',
    imageHouse: originalOrder?.imageHouse || '',
    imageID: originalOrder?.imageID || '',
    indications: originalOrder?.indications || '',
    items: originalOrder?.items || [],
    item: originalOrder?.item || null,
    itemBrand: originalOrder?.itemBrand || '',
    itemSerial: originalOrder?.itemSerial || '',
    street: originalOrder?.street || '',
    expireAt: originalOrder.expireAt || null
  }

  if (!originalOrder) return <ActivityIndicator />

  return (
    <FormOrder
      renew={originalOrder.folio}
      defaultValues={newOrder}
      onSubmit={async (order) => {
        //   .then(console.log)
        //   .catch(console.error)
        const renewedOrder = {
          ...order,
          status: order_status.DELIVERED,
          deliveredAt: order.expireAt,
          renewedAt: new Date(),
          renewedFrom: orderId
        }
        // @ts-ignore
        await ServiceOrders.create(renewedOrder)
          .then((res) => {
            if (res.ok)
              ServiceOrders.update(orderId, {
                status: order_status.RENEWED
              })

            // * Add comment to the new order
            ServiceOrders.addComment({
              storeId: order.storeId,
              orderId: res.res.id || '',
              type: 'comment',
              content: `Renovación de ordern No. ${originalOrder.folio} `
            })
              .then(() => {
                // @ts-ignore
                navigate('OrderDetails', { orderId: res.res.id || '' })
              })
              .catch(console.error)
            // * Add comment to the original order
            ServiceOrders.addComment({
              storeId: order.storeId,
              orderId,
              type: 'comment',
              content: `Orden renovada `
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
