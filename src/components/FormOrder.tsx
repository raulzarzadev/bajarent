import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Formik, useField } from 'formik'
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
          <View style={[styles.item]}>
            <InputDate
              value={asDate(values.scheduledAt) || new Date()}
              setValue={(value) =>
                setValues(
                  (values) => ({ ...values, scheduledAt: value }),
                  false
                )
              }
            />
          </View>
          <View style={[styles.item]}>
            <FormikInputValue name={'firstName'} placeholder="Nombre (s)" />
          </View>
          <View style={[styles.item]}>
            <FormikInputValue name={'lastName'} placeholder="Apellido (s)" />
          </View>
          <View style={[styles.item]}>
            <FormikInputPhone name={'phone'} />
          </View>
          <View style={[styles.item]}>
            <Button onPress={handleSubmit} label={'Guardar'} />
          </View>
        </View>
      )}
    </Formik>
  )
}

export default FormOrder

const styles = StyleSheet.create({
  form: {
    padding: 10
    // padding: theme.padding.md
  },
  item: {
    marginVertical: 10
  }
})
