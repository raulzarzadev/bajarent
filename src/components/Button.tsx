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
import { colors, Colors } from '../theme'
import Icon, { IconName } from './Icon'
import ErrorBoundary from './ErrorBoundary'

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
  id?: string
  fullWidth?: boolean
  progress?: number
  uppercase?: boolean
}

const ButtonX: React.FC<ButtonProps> = ({
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
  justIcon,
  fullWidth = true,
  progress,
  uppercase = true,
  ...props
}) => {
  const { theme } = useTheme()
  const buttonXColor = {
    backgroundColor: theme[color],
    borderColor: 'transparent'
  }
  const buttonXVariants = {
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
  const buttonXVariant = buttonXVariants[variant]
  const textColor = {
    color: variant === 'filled' ? theme.white : theme[color]
  }

  const sizes = {
    xs: { padding: 4 },
    small: { padding: 10 },
    medium: { padding: 15 },
    large: { padding: 20 }
  }
  const justIconStyles = {
    padding: sizes[size].padding,
    borderRadius: 9999,
    width: sizes[size].padding * 2,
    height: sizes[size].padding * 2
    //margin: 'auto'
  }

  if (justIcon) {
    label = ''
    children = null
  }

  return (
    <Pressable
      {...props}
      role="button"
      style={({ pressed }) => [
        !fullWidth && { flex: 1, alignSelf: 'flex-start' },
        baseStyles.buttonX,
        buttonXColor,
        buttonXVariant,
        disabled && baseStyles.disabled,
        pressed && { opacity: 0.5 },
        sizes[size],
        buttonStyles,
        justIcon && justIconStyles,
        disabled && variant === 'ghost' && { backgroundColor: 'transparent' }
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {!!progress && progress != 100 && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            backgroundColor: colors.black,
            opacity: 0.5,
            borderRadius: 5,
            width: `${progress}%`
          }}
        />
      )}
      {!justIcon && !children && (
        <Text
          style={[
            baseStyles.text,
            textColor,
            textStyles,
            disabled && baseStyles.disabled,
            uppercase && { textTransform: 'uppercase' }
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
            disabled && baseStyles.disabled
          ]}
        >
          {uppercase ? children?.toUpperCase() : children}
        </Text>
      ) : (
        children
      )}
      {!!icon && (
        <View style={{ marginLeft: label || children ? 4 : 0 }}>
          <Icon
            icon={icon}
            color={textColor.color}
            size={24}
            //  size={sizes[size].padding * 2}
          />
        </View>
      )}
    </Pressable>
  )
}

const baseStyles = StyleSheet.create({
  buttonX: {
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
    //backgroundColor,
    opacity: 0.4,
    borderColor: 'transparent'
  }
})

export default function Button(props: ButtonProps) {
  return (
    <ErrorBoundary componentName={`Button-${props.label}`}>
      <ButtonX {...props} />
    </ErrorBoundary>
  )
}
