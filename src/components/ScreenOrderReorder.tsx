import { ActivityIndicator } from 'react-native'
import { ServiceOrders } from '../firebase/ServiceOrders'
import OrderType, { order_status } from '../types/OrderType'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { getFullOrderData } from '../contexts/libs/getFullOrderData'
import { useCustomers } from '../state/features/costumers/costumersSlice'
import { useCurrentWork } from '../state/features/currentWork/currentWorkSlice'
import { FormOrder2E } from './FormOrder2'

const ScreenOrderReorder = ({ route }) => {
  const orderId = route?.params?.orderId
  const { navigate } = useNavigation()
  const { addWork } = useCurrentWork()
  const { data: customers } = useCustomers()
  const [originalOrder, setOriginalOrder] = useState<OrderType | null>(null)
  useEffect(() => {
    getFullOrderData(orderId).then((order) => setOriginalOrder(order))
  }, [orderId])
  const newOrder: Partial<OrderType> = {
    customerId: originalOrder?.customerId || '',
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
  }
  const customer = customers.find((c) => c?.id === originalOrder?.customerId)
  if (customer) {
    newOrder.fullName = customer.name
  }

  if (!originalOrder) return <ActivityIndicator />

  return (
    <FormOrder2E
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
            addWork({
              work: {
                type: 'order',
                action: 'reorder',
                details: {
                  orderId: orderId,
                  sectionId: order?.assignToSection || null
                }
              }
            })
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
