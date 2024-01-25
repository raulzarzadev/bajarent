import React from 'react'
import { Text, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native'

type ButtonProps = {
  onPress: () => void
  label?: string
  size?: 'small' | 'medium' | 'large'
  color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
  variant?: 'filled' | 'outline'
  disabled?: boolean
  children?: string
  buttonStyles?: ViewStyle
  textStyles?: TextStyle
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  label,
  size = 'medium',
  color = 'primary',
  variant = 'filled',
  disabled = false,
  children = 'Button label',
  buttonStyles,
  textStyles
}) => {
  const buttonBaseButtonStyles = [
    baseButtonStyles.button,
    baseButtonStyles[size],
    baseButtonStyles[color],
    variant === 'outline' && baseButtonStyles.outline,
    disabled && baseButtonStyles.disabled
  ]

  const textBaseButtonStyles = [
    baseButtonStyles.text,
    variant === 'outline' && baseButtonStyles.outlineText,
    disabled && baseButtonStyles.disabledText
  ]

  return (
    <Pressable
      style={({ pressed }) => [
        buttonBaseButtonStyles,
        pressed && baseButtonStyles.pressed,
        buttonStyles
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[textBaseButtonStyles, textStyles]}>
        {(label || children).toUpperCase()}
      </Text>
    </Pressable>
  )
}

const baseButtonStyles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  text: {
    fontSize: 14,
    color: '#fff'
  },
  small: {
    padding: 8
  },
  medium: {
    padding: 10
  },
  large: {
    padding: 12
  },
  primary: {
    backgroundColor: '#007bff'
  },
  secondary: {
    backgroundColor: '#6c757d'
  },
  success: {
    backgroundColor: '#28a745'
  },
  danger: {
    backgroundColor: '#dc3545'
  },
  warning: {
    backgroundColor: '#ffc107'
  },
  info: {
    backgroundColor: '#17a2b8'
  },
  light: {
    backgroundColor: '#f8f9fa'
  },
  dark: {
    backgroundColor: '#343a40'
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: '#007bff',
    borderWidth: 1
  },
  outlineText: {
    color: '#007bff'
  },
  disabled: {
    backgroundColor: '#6c757d'
  },
  disabledText: {
    color: '#fff'
  },
  pressed: {
    backgroundColor: '#0056b3'
  }
})

export default Button
