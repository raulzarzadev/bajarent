import type { ComponentProps } from 'react'
import { MdOutlineDone } from 'react-icons/md'

export function IconDone(props: ComponentProps<typeof MdOutlineDone>) {
	return <MdOutlineDone {...props} />
}

export default IconDone
