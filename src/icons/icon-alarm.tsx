import type { ComponentProps } from 'react'
import { MdOutlineAlarm } from 'react-icons/md'

export function IconAlarm(props: ComponentProps<typeof MdOutlineAlarm>) {
  return <MdOutlineAlarm {...props} />
}

export default IconAlarm
