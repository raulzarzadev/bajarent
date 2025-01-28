import BaseType from '../../../types/BaseType'

export type CustomerBase = {
  name: string
  contacts: Record<CustomerContact['id'], CustomerContact>
  address: CustomerAddress
  storeId: string
}

export type CustomerContact = {
  id: string
  label: string
  type: string
  value: string
}

export type CustomerType = CustomerBase & BaseType

export type CustomerAddress = {
  street: string
  references: string
  locationURL: string
  neighborhood?: string
  coords?: `${number},${number}`
}

export type NewCustomer = Partial<Omit<CustomerBase, 'storeId'>> &
  //* make storeId required
  Pick<CustomerBase, 'storeId'>
