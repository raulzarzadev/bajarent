import React from 'react'
import { StyleSheet, Pressable, Text, ViewStyle } from 'react-native'
import theme from '../theme'

interface ButtonProps {
  onPress?: () => void
  label?: string
  children?: string
  id?: string
  styles?: ViewStyle
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  label,
  children = 'Label',
  id,
  styles,
  disabled
}) => {
  return (
    <Pressable
      disabled={disabled}
      id={id}
      style={[
        baseStyles.button,
        styles,
        disabled ? baseStyles.buttonDisabled : null
      ]}
      onPress={onPress}
    >
      <Text style={baseStyles.buttonText}>
        <Text>{label || children}</Text>
      </Text>
    </Pressable>
  )
}

const baseStyles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.lightgrey
  },
  buttonDisabled: {
    backgroundColor: theme.colors.disabled,
    borderColor: theme.colors.lightgrey
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})

export default Button
