import { StyleSheet } from 'react-native'
import React from 'react'
import Button, { ButtonProps } from './Button'
import { Icon } from 'react-native-elements'
import theme from '../theme'
export type IconButtonProps = {
  icon: string
}
const ButtonIcon = (props: ButtonProps & IconButtonProps) => {
  const sizes = {
    small: 20,
    medium: 25,
    large: 30
  }
  return (
    <Button
      {...props}
      buttonStyles={{
        borderRadius: 9999,
        padding: 4,
        aspectRatio: '1',
        justifyContent: 'center',
        alignItems: 'center',
        width: sizes[props.size || 'medium'] * 1.4
      }}
    >
      <Icon
        name={props.icon}
        size={sizes[props.size || 'medium']}
        color={theme[props.color || 'primary']}
      />
    </Button>
  )
}

export default ButtonIcon

const styles = StyleSheet.create({})
