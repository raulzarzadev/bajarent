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
  const customerName = normalizeCustomerName(order?.fullName || '')
  //console.log({ order, customerContacts, customerImages })

  const newCustomer = {
    id: order?.customerId || null,
    name: customerName || '',

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
export const findSimilarCustomer = (
  customer: Partial<CustomerType>,
  customers: Partial<CustomerType>[]
): Partial<CustomerType> | null => {
  return (
    customers.find((c) => {
      if (c?.id === customer?.id) return true
      const storeCustomerPhoneNumbers = Object.values(c.contacts).map(
        (contact) => contact.value
      )
      const newCustomerPhoneNumbers = Object.values(customer.contacts).map(
        (contact) => contact.value
      )
      return storeCustomerPhoneNumbers.find((sPhone) =>
        newCustomerPhoneNumbers.includes(sPhone)
      )
    }) || null
  )
}

export const mergeOrderCustomerWithFoundCustomer = (
  orderCustomer: Partial<CustomerType>,
  customerFound: Partial<CustomerType>
) => {
  const customerName = getLargerName(orderCustomer.name, customerFound.name)
  // normalize name
  //1. remove spaces
  //2. upper case just first letter of each word
  //3. remove spaces at the end and start of the string
  const customerNameNormalized = normalizeCustomerName(customerName)
  return {
    id: customerFound.id,
    name: customerNameNormalized,
    ...customerFound,
    ...orderCustomer,
    contacts: {
      ...customerFound.contacts,
      ...orderCustomer.contacts
    },
    contactsList: [
      ...customerFound.contactsList,
      ...orderCustomer.contactsList
    ],
    images: {
      ...customerFound.images,
      ...orderCustomer.images
    }
  }
}

const getLargerName = (name1: string, name2: string) => {
  return name1.length > name2.length ? name1 : name2
}

export const normalizeCustomerName = (name: string) => {
  // 1. Primero limpiamos espacios extras y hacemos trim
  const cleanName = name.replace(/\s+/g, ' ').trim()

  // 2. Dividimos en palabras y capitalizamos solo la primera letra de cada palabra
  return cleanName
    .split(' ')
    .map((word) => {
      // Si la palabra está vacía, la retornamos tal cual
      if (!word) return word
      // Capitalizamos solo la primera letra y mantenemos el resto en minúsculas
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}
