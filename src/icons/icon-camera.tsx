import type { ComponentProps } from 'react'
import { MdOutlinePhotoCamera } from 'react-icons/md'

export function IconCamera(props: ComponentProps<typeof MdOutlinePhotoCamera>) {
  return <MdOutlinePhotoCamera {...props} />
}

export default IconCamera
