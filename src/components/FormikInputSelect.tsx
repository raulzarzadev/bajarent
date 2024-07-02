import { View, Text } from 'react-native'
import React from 'react'
import { useField } from 'formik'
import InputSelect from './InputSelect'
import { gStyles } from '../styles'

const FormikInputSelect = ({
  name,
  helperText = '',
  options = [],
  label = '',
  placeholder = '',
  disabled = false
}: {
  name: string
  helperText?: string
  options?: { label: string; value: string }[]
  label?: string
  placeholder?: string
  disabled?: boolean
}) => {
  const [field, meta, helpers] = useField(name)

  return (
    <View>
      {!!label && <Text>{label}</Text>}
      <InputSelect
        disabled={disabled}
        placeholder={placeholder}
        value={field.value || ''}
        options={options}
        onChangeValue={(value) => {
          helpers.setValue(value)
        }}
      />
      {!!helperText && !meta.error && (
        <Text style={gStyles.helper}>{helperText}</Text>
      )}
      {!!meta.error && <Text style={gStyles.helperError}>{meta.error}</Text>}
    </View>
  )
}

export default FormikInputSelect
