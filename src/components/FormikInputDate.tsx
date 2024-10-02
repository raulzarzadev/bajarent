import { View, Text } from 'react-native'
import React from 'react'
import { InputDateE } from './InputDate'
import { useField } from 'formik'
import { gStyles } from '../styles'
import asDate from '../libs/utils-date'

const FormikInputDate = ({ name, label = 'Fecha', withTime = false }) => {
  const [field, meta, helpers] = useField(name)
  return (
    <View>
      <InputDateE
        label={label}
        setValue={(value) => {
          helpers.setValue(value)
        }}
        value={asDate(field.value)}
        format="dd MMM yy"
        withTime={withTime}
      />
      {meta.error && <Text style={gStyles.helperError}>{meta.error}</Text>}
    </View>
  )
}

export default FormikInputDate
