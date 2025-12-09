import IconSvg, { type IconName } from '../icons'

const Icon = ({
  icon,
  size = 30,
  ...props
}: {
  icon: IconName | 'none'
  color?: string
  size?: number
}) => {
  if (icon === 'none') return null
  return <IconSvg name={icon} size={size} {...props} />
}

export type { IconName }
export default Icon
