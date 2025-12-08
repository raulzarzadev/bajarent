import type { ComponentProps } from 'react'
import { MdCopyAll } from 'react-icons/md'

export function IconCopy(props: ComponentProps<typeof MdCopyAll>) {
  return <MdCopyAll {...props} />
}

export default IconCopy
