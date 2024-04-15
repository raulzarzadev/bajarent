import { StyleSheet, TextStyle, ViewStyle } from 'react-native'
import React from 'react'
import BouncyCheckbox from 'react-native-bouncy-checkbox'

const InputCheckbox = ({
  label,
  setValue,
  value = false,
  style,
  textStyle,
  color
}: {
  label: string
  setValue: (value: boolean) => void
  value: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  color?: string
}) => {
  return (
    <BouncyCheckbox
      fillColor={color}
      style={[{ marginHorizontal: 'auto' }, style]}
      textStyle={[
        {
          textDecorationLine: 'none',
          textTransform: 'capitalize'
        },
        textStyle
      ]}
      isChecked={value}
      onPress={(isChecked: boolean) => {
        setValue(isChecked)
      }}
      text={label}
    />
  )
}

export default InputCheckbox

const styles = StyleSheet.create({})
