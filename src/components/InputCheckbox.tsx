import { StyleSheet, ViewStyle } from 'react-native'
import React from 'react'
import BouncyCheckbox from 'react-native-bouncy-checkbox'

const InputCheckbox = ({
  label,
  setValue,
  value = false,
  style,
  color
}: {
  label: string
  setValue: (value: boolean) => void
  value: boolean
  style?: ViewStyle
  color?: string
}) => {
  return (
    <BouncyCheckbox
      fillColor={color}
      style={[style, { marginHorizontal: 'auto' }]}
      textStyle={{
        textDecorationLine: 'none'
      }}
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
