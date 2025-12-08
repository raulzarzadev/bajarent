import type { ComponentProps } from 'react'
import { MdFilterList } from 'react-icons/md'

export function IconFilter(props: ComponentProps<typeof MdFilterList>) {
	return <MdFilterList {...props} />
}

export default IconFilter
