import { CustomerType } from '../../../state/features/costumers/customerType'

export const getFavoriteCustomerPhone = (
  customerContacts: CustomerType['contacts']
) => {
  const phones = Object.values(customerContacts || {})
    .filter((a) => a.type === 'phone')
    .sort((a, b) => {
      // set is favorite first
      if (a.isFavorite) return -1
    })
    .map((a) => a.value)
  return phones?.[0] || null
}
