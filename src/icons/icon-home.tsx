import type { ComponentProps } from 'react'
import { GoHomeFill } from 'react-icons/go'

export function IconHome(props: ComponentProps<typeof GoHomeFill>) {
	return <GoHomeFill {...props} />
}

export default IconHome
