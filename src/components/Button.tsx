import React from 'react'
import { Text, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import useTheme from '../hooks/useTheme'
import { Colors, Theme } from '../theme'

export type ButtonProps = {
  onPress: () => void
  label?: string
  size?: 'xs' | 'small' | 'medium' | 'large'
  color?: Colors
  variant?: 'filled' | 'outline' | 'ghost'
  disabled?: boolean
  children?: string | React.ReactNode
  buttonStyles?: ViewStyle
  textStyles?: TextStyle
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  label,
  disabled = false,
  children,
  buttonStyles,
  textStyles,
  variant = 'filled',
  color = 'primary'
}) => {
  const { theme } = useTheme()
  const buttonColor = {
    backgroundColor: theme[color],
    borderColor: 'transparent'
  }
  const buttonVariants = {
    filled: {
      backgroundColor: theme[color],
      borderColor: 'transparent'
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: theme[color]
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent'
    }
  }
  const buttonVariant = buttonVariants[variant]
  const textColor = {
    color: variant === 'filled' ? theme.white : theme[color]
  }

  return (
    <Pressable
      style={({ pressed }) => [
        baseStyles.button,
        buttonColor,
        buttonVariant,
        disabled && baseStyles.disabled,
        buttonStyles,
        pressed && { opacity: 0.5 }
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {!children && (
        <Text
          style={[
            baseStyles.text,
            textColor,
            textStyles,
            disabled && { color: 'black' }
          ]}
        >
          {label}
        </Text>
      )}
      {typeof children === 'string' && !label ? (
        <Text
          style={[
            baseStyles.text,
            textColor,
            textStyles,
            disabled && { color: 'black' }
          ]}
        >
          {children.toUpperCase()}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  )
}

const baseStyles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'transparent'
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold'
  },
  disabled: {
    backgroundColor: 'lightgrey',
    opacity: 0.2,
    borderColor: 'transparent'
  }
})

export default Button
