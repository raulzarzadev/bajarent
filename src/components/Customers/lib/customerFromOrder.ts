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
    contacts: customerOrderContacts(order as OrderType),
    images: customerImagesFromOrder({
      houseImage: order?.houseImage,
      ID: order?.ID,
      signature: order?.signature
    })
  }
  console.log({ newCustomer })
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
  console.log({ customerContacts })
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
