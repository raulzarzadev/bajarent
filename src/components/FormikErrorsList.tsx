import { Text, View } from 'react-native'
import React from 'react'
import { useFormikContext } from 'formik'
import { gStyles } from '../styles'
import theme from '../theme'

const FormikErrorsList = () => {
  const { errors } = useFormikContext()
  return (
    <View>
      {Object.entries(errors).map(([key, value]) => (
        <Text key={key} style={[gStyles.tError]}>
          * {value as string}
        </Text>
      ))}
    </View>
  )
}

export default FormikErrorsList
