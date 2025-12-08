import type { ComponentProps } from 'react'
import { FaCashRegister } from 'react-icons/fa'

export function IconCashbox(props: ComponentProps<typeof FaCashRegister>) {
  return <FaCashRegister {...props} />
}

export default IconCashbox
