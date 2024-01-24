import React from 'react'
import { StyleSheet, Pressable, Text, ViewStyle, TextStyle } from 'react-native'
import theme from '../theme'

interface ButtonProps {
  onPress?: () => void
  label?: string
  children?: string
  id?: string
  styles?: ViewStyle
  disabled?: boolean
  textStyles?: TextStyle
  size?: 'sm' | 'md' | 'lg'
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  label,
  children = 'Label',
  id,
  styles,
  disabled,
  textStyles,
  size = 'md'
}) => {
  const sizes = {
    sm: {
      padding: 8,
      fontSize: 12
    },
    md: {
      padding: 10,
      fontSize: 14
    },
    lg: {
      padding: 12,
      fontSize: 16
    }
  }
  return (
    <Pressable
      disabled={disabled}
      id={id}
      style={[
        baseStyles.button,
        styles,
        disabled ? baseStyles.buttonDisabled : null,
        { padding: sizes[size].padding }
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          baseStyles.buttonText,
          textStyles,
          { fontSize: sizes[size].fontSize }
        ]}
      >
        {label || children}
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
    textAlign: 'center',
    textTransform: 'uppercase'
  }
})

export default Button
