import { StyleSheet, Text } from 'react-native'
import React from 'react'
import { FONT_SIZE } from '../theme'

const H1 = ({
  children,
  size = 'md'
}: {
  children: string
  size?: 'sm' | 'md' | 'lg'
}) => {
  const fontSize = {
    xs: FONT_SIZE * 1.1,
    sm: FONT_SIZE * 1.3,
    md: FONT_SIZE * 1.8,
    lg: FONT_SIZE * 2.2,
    xl: FONT_SIZE * 3
  }
  return (
    <Text style={[styles.text, { fontSize: fontSize[size] }]}>{children}</Text>
  )
}

export default H1

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 0
  }
})
