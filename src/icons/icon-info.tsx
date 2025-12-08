import type { ComponentProps } from 'react'
import { MdInfoOutline } from 'react-icons/md'

export function IconInfo(props: ComponentProps<typeof MdInfoOutline>) {
  return <MdInfoOutline {...props} />
}

export default IconInfo
