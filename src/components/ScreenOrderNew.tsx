import FormOrder from './FormOrder'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useStore } from '../contexts/storeContext'
import OrderType, { order_status } from '../types/OrderType'
import { useAuth } from '../contexts/authContext'
import { orderExpireAt } from '../libs/orders'
import { onRentStart } from '../libs/order-actions'
import useMyNav from '../hooks/useMyNav'
import { useCustomers } from '../state/features/costumers/costumersSlice'
import { CustomerType } from '../state/features/costumers/customerType'
import { createUUID } from '../libs/createId'
import { onSendOrderWhatsapp } from '../libs/whatsapp/sendOrderMessage'
import { getFavoriteCustomerPhone } from './Customers/lib/lib'
import { useCurrentWork } from '../state/features/currentWork/currentWorkSlice'
//
const ScreenOrderNew = (navigation) => {
  const customerId = navigation?.route?.params?.customerId
  const { storeId, store } = useStore()
  const { addWork } = useCurrentWork()
  const { create } = useCustomers()
  const { user } = useAuth()
  const { toOrders } = useMyNav()
  const handleSubmit = async (values: OrderType) => {
    let newCustomerCreated = null
    if (!values.customerId) {
      const contactId = createUUID({ length: 8 })
      const newCustomer: Partial<CustomerType> = {
        name: values.fullName || '',
        address: {
          street: values.address || '',
          references: values.references || '',
          neighborhood: values.neighborhood || '',
          locationURL: values.location || '',
          coords: values.coords
            ? `${values.coords[0]},${values.coords[1]}`
            : null
        },
        contacts: {
          [contactId]: {
            label: 'Principal',
            value: values.phone || '',
            type: 'phone',
            id: contactId
          }
        }
      }

      let customerCreated = null
      if (!values?.excludeCustomer) {
        const { payload } = await create(storeId, newCustomer)
        customerCreated = payload
      }
      if (customerCreated) {
        newCustomerCreated = customerCreated
        //@ts-ignore
        values.customerId = customerCreated?.id
      }
    }
    const defaultValues = {
      //* Default values
      storeId: storeId,
      status: order_status.AUTHORIZED, //*****<--- always authorize
      authorizedAt: new Date(), //****+++++++*<--- always authorize
      authorizedBy: user?.id || '', //**++++***<--- always authorize
      deliveredAt: null,
      deliveredBy: null,
      ...values //********** <-- override default values
    }

    /* ********************************************
     *  for repairs
     *******************************************rz */
    if (defaultValues?.startRepair) {
      defaultValues.status = order_status.REPAIRING
      defaultValues.repairingAt = new Date()
      defaultValues.repairingBy = user.id
    }
    /* ********************************************
     *  if has delivered is true
     *******************************************rz */

    defaultValues.expireAt = orderExpireAt({ order: values })
    defaultValues.statuses = true //* it means is set with expireAt

    //* remove spaces in each field before saving
    Object.keys(defaultValues).forEach((key) => {
      if (typeof defaultValues[key] === 'string') {
        const normalized = defaultValues[key].replace(/\s+/g, ' ')
        defaultValues[key] = normalized.trim()
      }
    })
    return await ServiceOrders.createSerialOrder(defaultValues).then(
      async (orderId) => {
        if (orderId) {
          addWork({
            work: {
              type: 'order',
              action: 'created',
              details: {
                orderId: orderId,
                sectionId: defaultValues.assignToSection || null
              }
            }
          })
          const shouldSendWhatsappWhenNewOrder =
            !!store.chatbot?.enabled && !!store.chatbot.config.sendNewStoreOrder

          if (shouldSendWhatsappWhenNewOrder && newCustomerCreated) {
            await onSendOrderWhatsapp({
              customer: newCustomerCreated,
              store,
              type: 'sendNewStoreOrder',
              userId: user.id,
              phone: getFavoriteCustomerPhone(newCustomerCreated?.contacts),
              order: { ...defaultValues, id: orderId }
            })
              .then((res) => console.log({ res }))
              .catch((e) => console.log({ e }))
          }

          if (defaultValues?.hasDelivered) {
            // defaultValues.status = order_status.DELIVERED
            // defaultValues.deliveredAt = values.scheduledAt
            // defaultValues.deliveredBy = user.id
            await onRentStart({
              order: { ...defaultValues, id: orderId },
              userId: user.id,
              deliveredAt: values.scheduledAt,
              store,
              customer: newCustomerCreated
            })
          }
        }
        toOrders({ id: orderId })
        return { orderId }
      }
    )
  }
  return (
    <>
      <FormOrder onSubmit={handleSubmit} defaultValues={{ customerId }} />
    </>
  )
}

export default ScreenOrderNew
