import React, { useMemo } from 'react'
import { useField } from 'formik'
import InputCheckbox from './Inputs/InputCheckbox'
import { TextStyle, ViewStyle } from 'react-native'

const FormikCheckbox = ({
  name,
  label,
  textStyle,
  style,
  disabled
}: {
  name: string
  label: string
  textStyle?: TextStyle
  style?: ViewStyle
  disabled?: boolean
}) => {
  const [field, meta, helpers] = useField(name)
  const value = useMemo(() => field.value, [field.value])
  return (
    <InputCheckbox
      label={label}
      setValue={(isChecked: boolean) => {
        helpers.setValue(isChecked)
      }}
      value={value}
      style={style}
      textStyle={textStyle}
      disabled={disabled}
    />
  )
}

export default FormikCheckbox
