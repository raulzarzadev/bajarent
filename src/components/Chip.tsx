import { StyleSheet, ViewStyle } from 'react-native'
import React from 'react'
import { ChipProps, Chip as RNEChip } from 'react-native-elements'

const Chip = ({
  title,
  color,
  titleColor,
  size = 'md',
  style,
  ...props
}: ChipProps & {
  title: string
  color: string
  titleColor: string
  size?: 'sm' | 'md' | 'lg'
  style: ViewStyle
}) => {
  const sizes = {
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
      title={title}
      buttonStyle={[
        {
          padding: sizes[size].padding,
          backgroundColor: color
        },
        style
      ]}
      titleStyle={{
        color: titleColor,
        fontSize: sizes[size].fontSize,
        fontWeight: 'bold'
      }}
      {...props}
    />
  )
}

export default Chip
