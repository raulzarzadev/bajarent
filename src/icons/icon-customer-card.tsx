import type { ComponentProps } from 'react'
import { FaAddressCard } from 'react-icons/fa'

export function IconCustomerCard(props: ComponentProps<typeof FaAddressCard>) {
  return <FaAddressCard {...props} />
}

export default IconCustomerCard
