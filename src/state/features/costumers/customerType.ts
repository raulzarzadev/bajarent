import BaseType from '../../../types/BaseType'

export type CustomerBase = {
  name: string
  address: CustomerAddress
  storeId: string
  images?: CustomerImages
  contacts: Record<CustomerContact['id'], CustomerContact>
  contactsList?: CustomerContact['id'][]
}

export type CustomerContact = {
  id: string
  label: string
  type: string
  value: string
  deletedAt?: Date
  isFavorite?: boolean
}

export type CustomerType = CustomerBase & BaseType

export type CustomerAddress = {
  street: string
  references: string
  locationURL: string
  neighborhood?: string
  coords?: `${number},${number}`
}

export type CustomerImages = Record<
  ImageDescriptionType['id'],
  Partial<ImageDescriptionType>
>

export type ImageDescriptionType = {
  description: string
  src: string
  type: 'house' | 'ID' | 'signature' | 'item'
} & BaseType

export type NewCustomer = Partial<Omit<CustomerBase, 'storeId'>> &
  //* make storeId required
  Pick<CustomerBase, 'storeId' | 'name'>

export type CustomerCompiledType = {
  name: CustomerType['name']
  neighborhood: CustomerAddress['neighborhood']
  street: CustomerAddress['street']
  contacts: Record<CustomerContact['label'], CustomerContact['value']>
}
