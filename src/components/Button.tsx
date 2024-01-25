import React from 'react'
import { Text, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import useTheme from '../hooks/useTheme'
import { Colors, Theme } from '../theme'

export type ButtonProps = {
  onPress: () => void
  label?: string
  size?: 'xs' | 'small' | 'medium' | 'large'
  color?: Colors
  variant?: 'filled' | 'outline'
  disabled?: boolean
  children?: string
  buttonStyles?: ViewStyle
  textStyles?: TextStyle
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  label,
  disabled = false,
  children = 'Button label',
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
    }
  }
  const buttonVariant = buttonVariants[variant]
  const textColor = {
    color: variant === 'filled' ? theme.neutral : theme[color]
  }
  return (
    <Pressable
      style={({ pressed }) => [
        baseStyles.button,
        buttonColor,
        buttonVariant,
        buttonStyles
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[baseStyles.text, textColor, textStyles]}>
        {(label || children).toUpperCase()}
      </Text>
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
  }
})

export default Button
