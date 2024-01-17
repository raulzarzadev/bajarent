import { useState } from 'react'
export type Modal = {
  title?: string
}
const useModal = (props?: Modal) => {
  const [open, setOpen] = useState(false)
  const toggleOpen = () => setOpen(!open)

  return {
    open,
    toggleOpen,
    setOpen,
    title: props.title
  }
}

export default useModal
