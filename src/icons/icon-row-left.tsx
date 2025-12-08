import type { ComponentProps } from 'react'
import { GoChevronLeft } from 'react-icons/go'

export function IconRowLeft(props: ComponentProps<typeof GoChevronLeft>) {
  return <GoChevronLeft {...props} />
}

export default IconRowLeft
