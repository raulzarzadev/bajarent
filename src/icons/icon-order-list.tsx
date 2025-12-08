import type { ComponentProps } from 'react'
import { LuClipboardList } from 'react-icons/lu'

export function IconOrderList(props: ComponentProps<typeof LuClipboardList>) {
	return <LuClipboardList {...props} />
}

export default IconOrderList
