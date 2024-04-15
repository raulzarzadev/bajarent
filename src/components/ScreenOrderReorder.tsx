import { ActivityIndicator } from 'react-native'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useStore } from '../contexts/storeContext'
import FormOrder from './FormOrder'
import OrderType, { order_status } from '../types/OrderType'
import { useNavigation } from '@react-navigation/native'

const ScreenOrderReorder = ({ route }) => {
  const orderId = route?.params?.orderId
  const { navigate } = useNavigation()
  const { orders } = useStore()
  const originalOrder = orders.find((o) => o.id === orderId)

  const newOrder: Partial<OrderType> = {
    status: order_status.AUTHORIZED,
    storeId: originalOrder?.storeId || '',
    assignToSection: originalOrder?.assignToSection || '',
    assignToStaff: originalOrder?.assignToStaff || '',
    neighborhood: originalOrder?.neighborhood || '',
    phone: originalOrder?.phone,
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
    expireAt: null
  }

  if (!originalOrder) return <ActivityIndicator />

  return (
    <FormOrder
      //renew={originalOrder.folio}
      // title="Re Ordenar"
      defaultValues={newOrder}
      onSubmit={async (order) => {
        //   .then(console.log)
        //   .catch(console.error)
        const reOrder = {
          ...order,
          status: order_status.AUTHORIZED
        }
        // @ts-ignore
        await ServiceOrders.create(reOrder)
          .then((res) => {
            if (res.ok) {
              // @ts-ignore
              navigate('OrderDetails', { orderId: res?.res?.id })
            }
          })
          .catch(console.error)
      }}
    />
  )
}

export default ScreenOrderReorder