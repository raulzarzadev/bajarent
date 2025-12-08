import type { ComponentProps } from 'react'
import { TiPhone } from 'react-icons/ti'

export function IconPhone(props: ComponentProps<typeof TiPhone>) {
	return <TiPhone {...props} />
}

export default IconPhone
