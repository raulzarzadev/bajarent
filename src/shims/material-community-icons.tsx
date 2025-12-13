import type { ComponentProps } from 'react'
import Icon2, { type IconName } from '../icons'

// Minimal stub to satisfy react-native-paper's dynamic icon requires without bundling vector icons.
// Maps MaterialCommunityIcons names to project icons
const iconMap: Record<string, IconName> = {
  'chevron-left': 'rowLeft',
  'chevron-right': 'rowRight',
  'chevron-down': 'rowDown',
  'chevron-up': 'rowUp',
  calendar: 'calendar',
  clock: 'calendarTime',
  close: 'close',
  check: 'done',
  'pencil-outline': 'pencil',
  'menu-down': 'menuDown',
  'calendar-blank': 'calendar'
}

const MaterialCommunityIcon = (
  props: ComponentProps<'svg'> & { name?: string; size?: number }
) => {
  const { name, size = 24, ...rest } = props
  if (!name) return null

  const mappedIcon = iconMap[name]

  if (!mappedIcon) {
    console.warn(
      `[MaterialCommunityIcon] Icon "${name}" not mapped. Add it to iconMap.`
    )
    return null
  }
  return <Icon2 name={mappedIcon as any} size={size} {...rest} />
}

export default MaterialCommunityIcon
