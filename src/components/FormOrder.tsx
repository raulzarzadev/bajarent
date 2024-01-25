import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Formik, useField } from 'formik'
import theme from '../theme'
import FormikInputValue from './FormikInputValue'
import OrderType from '../types/OrderType'
import Button from './Button'

import FormikInputPhone from './FormikInputPhone'
import InputDate from './InputDate'
import asDate from '../libs/utils-date'

const initialValues: Partial<OrderType> = {
  firstName: '',
  phone: '',
  scheduledAt: new Date()
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
      {({ handleSubmit, setValues, values }) => (
        <View style={styles.form}>
          <InputDate
            value={asDate(values.scheduledAt) || new Date()}
            setValue={(value) =>
              setValues((values) => ({ ...values, scheduledAt: value }), false)
            }
          />
          <FormikInputValue name={'firstName'} placeholder="Nombre (s)" />
          <FormikInputValue name={'lastName'} placeholder="Apellido (s)" />
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
