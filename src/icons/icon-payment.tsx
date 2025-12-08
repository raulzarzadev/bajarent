import type { ComponentProps } from 'react'
import { MdOutlinePaid } from 'react-icons/md'

export function IconPayment(props: ComponentProps<typeof MdOutlinePaid>) {
  return <MdOutlinePaid {...props} />
}

export default IconPayment
