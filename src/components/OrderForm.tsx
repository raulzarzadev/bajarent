import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import StyledTextInput from './StyledTextInput'
import StyledButton from './StyledButton'

const OrderForm = () => {
  return (
    <Formik
      initialValues={{ email: '' }}
      onSubmit={(values) => console.log(values)}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View>
          <StyledTextInput
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
          />
          <StyledButton
            onPress={handleSubmit}
            title="Submit"
            label={'Guardar'}
          />
        </View>
      )}
    </Formik>
  )
}

export default OrderForm

const styles = StyleSheet.create({})
