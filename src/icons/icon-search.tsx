import type { ComponentProps } from 'react'
import { MdOutlineSearch } from 'react-icons/md'

export function IconSearch(props: ComponentProps<typeof MdOutlineSearch>) {
	return <MdOutlineSearch {...props} />
}

export default IconSearch
