import type { ComponentProps } from 'react'
import { PiSiren } from 'react-icons/pi'

export function IconReport(props: ComponentProps<typeof PiSiren>) {
	return <PiSiren {...props} />
}

export default IconReport
