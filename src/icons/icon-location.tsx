import type { ComponentProps } from 'react'
import { MdLocationPin } from 'react-icons/md'

export function IconLocation(props: ComponentProps<typeof MdLocationPin>) {
  return <MdLocationPin {...props} />
}

export default IconLocation
