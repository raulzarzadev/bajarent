import React from 'react'
import {
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View
} from 'react-native'
import useTheme from '../hooks/useTheme'
import { Colors } from '../theme'
import Icon, { IconName } from './Icon'

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
  icon?: IconName
  justIcon?: boolean
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  label,
  disabled = false,
  children,
  buttonStyles,
  textStyles,
  variant = 'filled',
  color = 'primary',
  size = 'medium',
  icon,
  justIcon
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

  const justIconStyles = {
    padding: 5,
    borderRadius: 9999,
    width: 30,
    height: 30,
    margin: 'auto'
  }

  const sizes = {
    xs: { padding: 5 },
    small: { padding: 10 },
    medium: { padding: 15 },
    large: { padding: 20 }
  }

  if (justIcon) {
    label = ''
    children = null
  }

  return (
    <Pressable
      style={({ pressed }) => [
        baseStyles.button,
        buttonColor,
        buttonVariant,
        disabled && baseStyles.disabled,
        pressed && { opacity: 0.5 },
        sizes[size],
        buttonStyles,
        justIcon && justIconStyles
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {!justIcon && !children && (
        <Text
          style={[
            baseStyles.text,
            textColor,
            textStyles,
            disabled && { color: 'black' },
            { textTransform: 'uppercase' }
          ]}
        >
          {label}
        </Text>
      )}
      {!justIcon && typeof children === 'string' && !label ? (
        <Text
          style={[
            baseStyles.text,
            textColor,
            textStyles,
            disabled && { color: 'black' }
          ]}
        >
          {children?.toUpperCase()}
        </Text>
      ) : (
        children
      )}
      {!!icon && (
        <View style={{ marginLeft: label || children ? 4 : 0 }}>
          <Icon icon={icon} color={textColor.color} size={26} />
        </View>
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
