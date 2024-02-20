import { useState } from 'react'
import { StyledModalProps } from '../components/StyledModal'
export type Modal = {
  title?: string
}
const useModal = (props?: Modal & StyledModalProps) => {
  const [open, setOpen] = useState(false)
  const toggleOpen = () => setOpen(!open)

  return {
    open,
    toggleOpen,
    setOpen,
    title: props?.title
  }
}

export default useModal
