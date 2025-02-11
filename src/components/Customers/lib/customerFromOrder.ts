import { createUUID } from '../../../libs/createId'
import {
  CustomerImages,
  CustomerType
} from '../../../state/features/costumers/customerType'
import OrderType from '../../../types/OrderType'

export const customerFromOrder = (
  order: Partial<OrderType>,
  { storeId }: { storeId: string } = { storeId: '' }
): Partial<CustomerType> & {
  orderId?: string | null
  orderFolio?: number | null
  storeId?: string | null
} => {
  //@ts-ignore FIXME: this order some times is not a OrderType ej. ListOrdersConsolidated.tsx: 10

  const customerContacts: CustomerType['contacts'] = customerOrderContacts(
    order as OrderType
  )
  const customerImages = customerImagesFromOrder({
    houseImage: order?.imageHouse,
    ID: order?.imageID,
    signature: order?.signature
  })
  if (typeof order?.customerId === 'string') {
  }
  const contactsList = Object.values(customerContacts || {}).map(
    (contact) => contact.value
  )
  //console.log({ order, customerContacts, customerImages })

  const newCustomer = {
    id: order?.customerId || null,
    name: order?.fullName || '',

    orderId: order?.id || null,
    orderFolio: order?.folio || null,
    storeId: order?.storeId || storeId || null,
    contactsList,
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
    contacts: customerContacts,
    images: customerImages
  }
  return newCustomer
}
const customerOrderContacts = (order: OrderType) => {
  const orderContacts = order?.contacts

  let customerContacts = {}

  if (Array.isArray(orderContacts)) {
    customerContacts = orderContacts.reduce((acc, contact, index) => {
      const contactId = createUUID({ length: 8 })
      acc[contactId] = {
        label: contact?.name || `Contacto ${index + 1}`,
        value: contact?.phone,
        type: 'phone',
        id: contactId,
        isFavorite: !!contact?.isFavorite
      }
      return acc
    }, {})
  }
  customerContacts['default'] = {
    label: 'Default',
    value: order?.phone || '',
    type: 'phone',
    id: 'default'
  }
  return customerContacts
}

export const customerImagesFromOrder = ({
  houseImage,
  ID,
  signature
}): CustomerImages => {
  let customerImages: CustomerImages = {}
  if (houseImage) {
    const id = createUUID({ length: 8 })
    customerImages[id] = {
      src: houseImage,
      description: 'Casa',
      type: 'house',
      id
    }
  }
  if (ID) {
    const id = createUUID({ length: 8 })
    customerImages[id] = {
      src: ID,
      description: 'Identificación',
      type: 'ID',
      id
    }
  }
  if (signature) {
    const id = createUUID({ length: 8 })
    customerImages[id] = {
      src: signature,
      description: 'Firma',
      type: 'signature',
      id
    }
  }
  return customerImages
}
