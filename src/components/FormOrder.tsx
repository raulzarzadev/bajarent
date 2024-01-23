import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import theme from '../theme'
import FormikInputValue from './FormikInputValue'
import OrderType from '../types/OrderType'
import Button from './Button'

const initialValues: Partial<OrderType> = {
  firstName: '',
  phone: ''
}
const FormOrder = ({
  onSubmit = async (values) => {
    console.log(values)
  }
}) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values) => {
        onSubmit(values).then(console.log).catch(console.error)
      }}
    >
      {({ handleSubmit }) => (
        <View style={styles.form}>
          <FormikInputValue name={'firstName'} placeholder="Nombre" />
          <FormikInputValue name={'phone'} placeholder="Teléfono" />
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
