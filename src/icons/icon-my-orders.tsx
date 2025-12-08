import type { ComponentProps } from 'react'
import { PiUserList } from 'react-icons/pi'

export function IconMyOrders(props: ComponentProps<typeof PiUserList>) {
	return <PiUserList {...props} />
}

export default IconMyOrders
