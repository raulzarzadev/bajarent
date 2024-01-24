import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Formik, useField } from 'formik'
import theme from '../theme'
import FormikInputValue from './FormikInputValue'
import OrderType from '../types/OrderType'
import Button from './Button'

import FormikInputPhone from './FormikInputPhone'

const initialValues: Partial<OrderType> = {
  firstName: '',
  phone: ''
}
const FormOrder = ({
  onSubmit = async (values) => {
    console.log(values)
  },
  defaultValues = initialValues
}) => {
  return (
    <Formik
      initialValues={defaultValues}
      onSubmit={async (values) => {
        onSubmit(values).then(console.log).catch(console.error)
      }}
    >
      {({ handleSubmit, values }) => (
        <View style={styles.form}>
          <FormikInputValue name={'firstName'} placeholder="Nombre" />
          <FormikInputPhone name={'phone'} />

          <Button onPress={handleSubmit} label={'Guardar'} />
        </View>
      )}
    </Formik>
  )
}

export default FormOrder

const styles = StyleSheet.create({
  form: {
    padding: theme.padding.md
  }
})
