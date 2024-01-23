import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import theme from './theme'

const H1 = ({ children, size = 'lg' }) => {
  const fontSize = {
    xs: theme.font.size.lg * 0.8,
    sm: theme.font.size.lg * 1,
    md: theme.font.size.lg * 1.2,
    lg: theme.font.size.lg * 1.6
  }
  return (
    <Text style={[styles.text, { fontSize: fontSize[size] }]}>{children}</Text>
  )
}

export default H1

const styles = StyleSheet.create({
  text: {
    ...theme.h1
  }
})
