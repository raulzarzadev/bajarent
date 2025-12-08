import type { ComponentProps } from 'react'
import { MdPendingActions } from 'react-icons/md'

export function IconPending(props: ComponentProps<typeof MdPendingActions>) {
  return <MdPendingActions {...props} />
}

export default IconPending
