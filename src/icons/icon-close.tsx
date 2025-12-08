import type { ComponentProps } from 'react'
import { MdClose } from 'react-icons/md'

export function IconClose(props: ComponentProps<typeof MdClose>) {
	return <MdClose {...props} />
}

export default IconClose
