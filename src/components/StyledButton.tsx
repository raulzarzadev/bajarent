import { DimensionValue, Pressable, StyleSheet, Text } from 'react-native'
import React from 'react'
import theme from './theme'

const StyledButton = ({ ...props }) => {
  return (
    <Pressable style={styles.button} {...props}>
      <Text style={styles.buttonLabel}>{props.children || props.label}</Text>
    </Pressable>
  )
}

export default StyledButton

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: theme.colors.highlight,
    borderRadius: theme.borderRadius.sm,
    padding: theme.padding.sm,
    marginVertical: 1,
    width: '100%',
    backgroundColor: theme.colors.primary
  },
  buttonLabel: {
    textAlign: 'center',
    textTransform: 'uppercase'
  }
})
