import type { ReactNode } from 'react'
import { StyleSheet, Text, type TextStyle } from 'react-native'
import theme, { FONT_SIZE } from '../theme'

const P = ({
  children,
  size = 'md',
  bold = false,
  styles
}: {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  children: ReactNode
  bold?: boolean
  styles?: TextStyle
}) => {
  const fontSize = {
    xs: FONT_SIZE * 0.8,
    sm: FONT_SIZE * 1,
    md: FONT_SIZE * 1.2,
    lg: FONT_SIZE * 1.6,
    xl: FONT_SIZE * 2.4
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
    color: theme.black,
    textAlign: 'center',
    marginVertical: 8
  }
})
