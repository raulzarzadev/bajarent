import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import theme from './theme'

const H1 = ({ children }) => {
  return <Text style={styles.text}>{children}</Text>
}

export default H1

const styles = StyleSheet.create({
  text: {
    ...theme.h1
  }
})
