import { useState } from 'react'
import { StyledModalProps } from '../components/StyledModal'
export type Modal = {
  title?: string
}
const useModal = (props?: Modal & StyledModalProps) => {
  const [open, setOpen] = useState(false)
  const toggleOpen = () => {
    console.log('toggle')
    setOpen(!open)
  }
  const handleSetOpen = (value) => {
    console.log('handle open', value)
    if (value === open) return
    setOpen(value)
  }

  return {
    open,
    toggleOpen,
    setOpen: handleSetOpen,
    title: props?.title
  }
}

export type ReturnModal = ReturnType<typeof useModal>

export default useModal
