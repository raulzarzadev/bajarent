import type { ComponentProps } from 'react'
import { TbMapSearch } from 'react-icons/tb'

export function IconMap(props: ComponentProps<typeof TbMapSearch>) {
  return <TbMapSearch {...props} />
}

export default IconMap
