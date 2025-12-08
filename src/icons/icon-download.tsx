import type { ComponentProps } from 'react'
import { MdDownload } from 'react-icons/md'

export function IconDownload(props: ComponentProps<typeof MdDownload>) {
	return <MdDownload {...props} />
}

export default IconDownload
