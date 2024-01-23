import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import theme from './theme'

const P = ({ children }) => {
  return <Text style={styles.text}>{children}</Text>
}

export default P

const styles = StyleSheet.create({
  text: {
    ...theme.p
  }
})
