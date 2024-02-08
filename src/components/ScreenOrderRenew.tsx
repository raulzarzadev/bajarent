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
  const order = orders.find((o) => o.id === orderId)

  const newOrder: Partial<OrderType> = {
    storeId: order?.storeId || '',
    assignToSection: order?.assignToSection || '',
    assignToStaff: order?.assignToStaff || '',
    neighborhood: order?.neighborhood || '',
    phone: order?.phone,
    status: order_status.DELIVERED,
    type: order?.type,
    firstName: order?.firstName || '',
    lastName: order?.lastName || '',
    fullName: order?.fullName || '',
    address: order?.address || '',
    betweenStreets: order?.betweenStreets || '',
    location: order?.location || '',
    email: order?.email || '',
    description: order?.description || '',
    imageHouse: order?.imageHouse || '',
    imageID: order?.imageID || '',
    indications: order?.indications || '',
    items: order?.items || [],
    item: order?.item || null,
    itemBrand: order?.itemBrand || '',
    itemSerial: order?.itemSerial || '',
    street: order?.street || '',
    expireAt: order.expireAt || null
  }

  if (!order) return <ActivityIndicator />

  return (
    <FormOrder
      renew
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

        await ServiceOrders.create(renewedOrder)
          .then((res) => {
            if (res.ok)
              ServiceOrders.update(orderId, {
                status: order_status.RENEWED
              })
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
