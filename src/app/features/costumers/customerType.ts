export type CustomerContact = {
  id: string
  label: string
  type: string
  value: string
}
export type CustomerType = {
  id: string
  name: string
  contacts: Record<CustomerContact['id'], CustomerContact>
  address: CustomerAddress
}
export type CustomerAddress = {
  street: string
  references: string
  locationURL: string
  coords: [number, number]
}
