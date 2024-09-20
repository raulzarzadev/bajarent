import { StyleSheet, Switch, Text, View } from 'react-native'
import React from 'react'
import theme, { Colors } from '../theme'

const InputSwitch = ({
  value,
  disabled,
  setValue,
  color = 'primary'
}: {
  value: boolean
  disabled?: boolean
  setValue: (value: boolean) => void
  color?: Colors
}) => {
  return (
    <Switch
      disabled={disabled}
      style={{
        opacity: disabled ? 0.3 : 1
      }}
      trackColor={{
        true: theme[color],
        false: theme.neutral
      }}
      onValueChange={setValue}
      value={value}
    />
  )
}

export default InputSwitch

const styles = StyleSheet.create({})
