import type { ComponentProps } from 'react'
import { MdOutlineInventory } from 'react-icons/md'

export function IconInventory(
  props: ComponentProps<typeof MdOutlineInventory>
) {
  return <MdOutlineInventory {...props} />
}

export default IconInventory
