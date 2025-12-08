import type { ComponentProps } from 'react'
import { MdSettings } from 'react-icons/md'

export function IconSettings(props: ComponentProps<typeof MdSettings>) {
	return <MdSettings {...props} />
}

export default IconSettings
