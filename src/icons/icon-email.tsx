import type { ComponentProps } from 'react'
import { MdOutlineMailOutline } from 'react-icons/md'

export function IconEmail(props: ComponentProps<typeof MdOutlineMailOutline>) {
	return <MdOutlineMailOutline {...props} />
}

export default IconEmail
