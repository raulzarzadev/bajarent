import { createUUID } from '../../../libs/createId'
import { replaceUndefinedWithNull } from '../../../libs/removeUndefinedValues'
import type {
  CustomerImages,
  CustomerType
} from '../../../state/features/costumers/customerType'
import type OrderType from '../../../types/OrderType'

export const customerFromOrder = (
  order: Partial<OrderType>,
  { storeId }: { storeId: string } = { storeId: '' }
): Partial<CustomerType> & {
  orderId?: string | null
  orderFolio?: number | null
  storeId?: string | null
} => {
  // FIXME: this order some times is not a OrderType ej. ListOrdersConsolidated.tsx: 10

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
    (contact) => contact.value || ''
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
      //@ts-expect-error
      street: order?.address || '',
      //@ts-expect-error
      references: order?.references || '',
      neighborhood: order?.neighborhood || '',
      locationURL: order?.location || '',
      //@ts-expect-error
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
  const defaultContactId = createUUID({ length: 8 })
  customerContacts[defaultContactId] = {
    label: 'Default',
    value: order?.phone || '',
    type: 'phone',
    id: defaultContactId
  }
  return customerContacts
}

export const customerImagesFromOrder = ({
  houseImage,
  ID,
  signature
}): CustomerImages => {
  const customerImages: CustomerImages = {}
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

export const mergeCustomers = (
  customer1: Partial<CustomerType>,
  customer2: Partial<CustomerType>
) => {
  const customerName1 = normalizeCustomerName(customer1?.name || '')
  const customerName2 = normalizeCustomerName(customer2?.name || '')

  const name =
    customerName1.includes(customerName2) ||
    customerName2.includes(customerName1)
      ? customerName1
      : `${customerName1}, ${customerName2}`

  const customerMerged = {
    ...customer2,
    ...customer1,
    contacts: mergeContacts(customer1.contacts, customer2.contacts),
    images: mergeImages(customer1.images, customer2.images),
    id: customer1?.id,
    name
  }
  return replaceUndefinedWithNull(customerMerged)
}

const mergeImages = (
  images1: CustomerImages = {},
  images2: CustomerImages = {}
) => {
  const mergedImages = { ...images1 }
  const existingValues = Object.values(images1).map((image) => image.src)

  // Solo añadir imágenes que no existan ya
  Object.entries(images2).forEach(([key, image]) => {
    if (!existingValues.includes(image.src)) {
      mergedImages[key] = image
    }
  })

  return mergedImages
}
const mergeContacts = (
  contacts1: Record<string, any> = {},
  contacts2: Record<string, any> = {}
) => {
  const mergedContacts = { ...contacts1 }
  const existingValues = Object.values(contacts1).map(
    (contact) => contact.value
  )

  // Solo añadir contactos que no existan ya
  Object.entries(contacts2).forEach(([key, contact]) => {
    if (!existingValues.includes(contact.value)) {
      mergedContacts[key] = contact
    }
  })

  return mergedContacts
}

// const getLargerName = (name1: string, name2: string) => {
//   return name1.length > name2.length ? name1 : name2
// }

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
