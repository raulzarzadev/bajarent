import type { ComponentProps } from 'react'
import { LuClipboard } from 'react-icons/lu'

export function IconOrder(props: ComponentProps<typeof LuClipboard>) {
	return <LuClipboard {...props} />
}

export default IconOrder
