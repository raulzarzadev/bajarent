import type { ComponentProps } from 'react'
import { MdListAlt } from 'react-icons/md'

export function IconList(props: ComponentProps<typeof MdListAlt>) {
	return <MdListAlt {...props} />
}

export default IconList
