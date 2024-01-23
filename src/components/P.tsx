import { StyleSheet, Text, TextStyle, View } from 'react-native'
import React, { ReactNode } from 'react'
import theme from '../theme'

const P = ({
  children,
  size = 'md',
  bold = false,
  styles
}: {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  children: ReactNode
  bold?: boolean
  styles?: TextStyle
}) => {
  const fontSize = {
    xs: theme.font.size.md * 0.8,
    sm: theme.font.size.md * 1,
    md: theme.font.size.md * 1.2,
    lg: theme.font.size.md * 1.6
  }
  return (
    <Text
      style={[
        defaultStyles.text,
        { fontSize: fontSize[size], fontWeight: bold ? 'bold' : 'normal' },
        styles
      ]}
    >
      {children}
    </Text>
  )
}

export default P

const defaultStyles = StyleSheet.create({
  text: {
    ...theme.p
  }
})
