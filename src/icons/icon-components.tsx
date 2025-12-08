import type { ComponentProps } from 'react'
import { LuComponent } from 'react-icons/lu'

export function IconComponents(props: ComponentProps<typeof LuComponent>) {
	return <LuComponent {...props} />
}

export default IconComponents
