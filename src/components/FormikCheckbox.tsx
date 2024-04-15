import React, { useMemo } from 'react'
import { useField } from 'formik'
import InputCheckbox from './InputCheckbox'
import { TextStyle, ViewStyle } from 'react-native'

const FormikCheckbox = ({
  name,
  label,
  textStyle,
  style
}: {
  name: string
  label?: string
  textStyle?: TextStyle
  style?: ViewStyle
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
    />
  )
}

export default FormikCheckbox
