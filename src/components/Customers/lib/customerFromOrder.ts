import { ConsolidatedOrderType } from '../../../firebase/ServiceConsolidatedOrders'
import { createUUID } from '../../../libs/createId'
import { CustomerType } from '../../../state/features/costumers/customerType'
import OrderType from '../../../types/OrderType'

export const customerFromOrder = (
  order: Partial<OrderType> | Partial<ConsolidatedOrderType>,
  { storeId }: { storeId: string } = { storeId: '' }
): Partial<CustomerType> & {
  orderId?: string | null
  orderFolio?: number | null
  storeId?: string | null
} => {
  const newCustomer = {
    id: order?.customerId || null,
    name: order?.fullName || '',

    orderId: order?.id || null,
    orderFolio: order?.folio || null,
    storeId: storeId || null,

    address: {
      //@ts-ignore
      street: order?.address || '',
      //@ts-ignore
      references: order?.references || '',
      neighborhood: order?.neighborhood || '',
      locationURL: order?.location || '',
      //@ts-ignore
      coords: order?.coords
        ? //@ts-ignore
          (`${order?.coords[0]},${order?.coords[1]}` as `${number},${number}`)
        : null
    },
    contacts: customerOrderContacts(order)
  }

  return newCustomer
}
const customerOrderContacts = (order) => {
  const orderContacts = order?.contacts

  let customerContacts = {}
  if (!orderContacts) {
    const contactId = createUUID({ length: 8 })
    customerContacts = {
      [contactId]: {
        label: 'Principal',
        value: order?.phone || '',
        type: 'phone'
        // id: contactId
      }
    }
  }
  if (Array.isArray(orderContacts)) {
    customerContacts = orderContacts.reduce((acc, contact, index) => {
      const contactId = createUUID({ length: 8 })
      acc[contactId] = {
        label: contact.label || `Contacto ${index + 1}`,
        value: contact.value,
        type: contact.type,
        id: contactId
      }
      return acc
    }, {})
  }
  return customerContacts
}
