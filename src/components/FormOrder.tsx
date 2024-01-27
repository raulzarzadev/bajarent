import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import InputValueFormik from './InputValueFormik'
import OrderType from '../types/OrderType'
import Button from './Button'

import FormikInputPhone from './InputPhoneFormik'
import InputDate from './InputDate'
import asDate from '../libs/utils-date'
import InputLocationFormik from './InputLocationFormik'
import InputRadiosFormik from './InputRadiosFormik'
import { useStore } from '../contexts/storeContext'
import FormikInputImage from './FormikInputImage'

const initialValues: Partial<OrderType> = {
  firstName: '',
  phone: '',
  scheduledAt: new Date(),
  type: 'RENT'
}

const FormOrder = ({
  onSubmit = async (values) => {
    console.log(values)
  },
  defaultValues = initialValues
}) => {
  const { staff } = useStore()

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

          <View style={[styles.item, { justifyContent: 'center' }]}>
            <InputRadiosFormik
              name="type"
              options={[
                { label: 'Renta', value: 'RENT' },
                { label: 'Reparación', value: 'REPAIR' }
              ]}
              label="Tipo de orden"
            />
          </View>
          <View style={[styles.item, { justifyContent: 'center' }]}>
            <InputRadiosFormik
              name="assignTo"
              options={staff.map((s) => ({ label: s.position, value: s.id }))}
              label="Asignar a"
            />
          </View>
          <View style={[styles.item]}>
            <InputValueFormik name={'firstName'} placeholder="Nombre (s)" />
          </View>
          <View style={[styles.item]}>
            <InputValueFormik name={'lastName'} placeholder="Apellido (s)" />
          </View>
          <View style={[styles.item]}>
            <FormikInputPhone name={'phone'} />
          </View>
          <View style={[styles.item]}>
            <InputLocationFormik name={'location'} />
          </View>
          <View style={[styles.item]}></View>
          <View style={[styles.item]}>
            <FormikInputImage name="imageID" label="Subir identificación" />
          </View>
          <View style={[styles.item]}>
            <FormikInputImage name="imageHouse" label="Subir fachada " />
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
    maxWidth: 500,
    width: '100%',
    marginHorizontal: 'auto',
    padding: 10
    // padding: theme.padding.md
  },
  item: {
    marginVertical: 10
  }
})
