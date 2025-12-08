import type { ComponentProps } from 'react'
import { MdDeleteOutline } from 'react-icons/md'

export function IconDelete(props: ComponentProps<typeof MdDeleteOutline>) {
  return <MdDeleteOutline {...props} />
}

export default IconDelete
