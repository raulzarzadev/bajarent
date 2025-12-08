import type { ComponentProps } from 'react'
import { LuBot } from 'react-icons/lu'

export function IconChatbot(props: ComponentProps<typeof LuBot>) {
  return <LuBot {...props} />
}

export default IconChatbot
