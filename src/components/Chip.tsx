import { ViewStyle } from 'react-native'
import React from 'react'
import { ChipProps, Chip as RNEChip } from 'react-native-elements'
import { IconOrderType } from '../types/OrderType'
import Icon from './Icon'
export type Size = 'xs' | 'sm' | 'md' | 'lg'
const Chip = ({
  title = '',
  color,
  titleColor,
  size = 'md',
  style,
  onPress,
  maxWidth,
  ...props
}: ChipProps & {
  title: string
  color: string
  titleColor?: string
  size?: Size
  style?: ViewStyle
  maxWidth?: ViewStyle['maxWidth']
  onPress?: () => void
}) => {
  const sizes = {
    xs: {
      fontSize: 7,
      padding: 3
    },
    sm: {
      fontSize: 10,
      padding: 5
    },
    md: {
      fontSize: 12,
      padding: 8
    },
    lg: {
      fontSize: 14,
      padding: 10
    }
  }
  return (
    <RNEChip
      title={title?.toUpperCase()}
      buttonStyle={[
        {
          padding: sizes[size].padding,
          backgroundColor: color
        },
        style
      ]}
      titleProps={{
        numberOfLines: 1
      }}
      titleStyle={{
        color: titleColor,
        fontSize: sizes[size].fontSize,
        fontWeight: 'bold',
        maxWidth
      }}
      onPress={onPress}
      {...props}
    />
  )
}

export default Chip
