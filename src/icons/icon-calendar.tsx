import type { ComponentProps } from 'react'
import { LuCalendar } from 'react-icons/lu'

export function IconCalendar(props: ComponentProps<typeof LuCalendar>) {
	return <LuCalendar {...props} />
}

export default IconCalendar
