import type { ComponentProps } from 'react'
import { MdEdit } from 'react-icons/md'

export function IconEdit(props: ComponentProps<typeof MdEdit>) {
	return <MdEdit {...props} />
}

export default IconEdit
