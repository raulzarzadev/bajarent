import { ActivityIndicator } from 'react-native'
import { ServiceOrders } from '../firebase/ServiceOrders'
import FormOrder from './FormOrder'
import OrderType, { order_status } from '../types/OrderType'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { getFullOrderData } from '../contexts/libs/getFullOrderData'

const ScreenOrderReorder = ({ route }) => {
  const orderId = route?.params?.orderId
  const { navigate } = useNavigation()
  const [originalOrder, setOriginalOrder] = useState<OrderType | null>(null)
  useEffect(() => {
    getFullOrderData(orderId).then((order) => setOriginalOrder(order))
  }, [orderId])
  const newOrder: Partial<OrderType> = {
    contacts: originalOrder?.contacts || [],
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
    imageHouse: originalOrder?.imageHouse || '',
    imageID: originalOrder?.imageID || '',
    indications: originalOrder?.indications || '',
    street: originalOrder?.street || '',
    expireAt: null,
    references: originalOrder?.references || ''
    // description: originalOrder?.description || '', //* describe the failure
    //items: originalOrder?.items || [],
    //item: originalOrder?.item || null,
    //itemBrand: originalOrder?.itemBrand || '',
    //itemSerial: originalOrder?.itemSerial || '',
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
        await ServiceOrders.createSerialOrder(reOrder)
          .then((orderId) => {
            if (orderId) {
              // @ts-ignore
              navigate('OrderDetails', { orderId: orderId })
            }
          })
          .catch(console.error)
      }}
    />
  )
}

export default ScreenOrderReorder
