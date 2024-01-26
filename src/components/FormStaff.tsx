import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import FormikInputValue from './InputValueFormik'
import Button from './Button'

const FormStaff = ({
  defaultValues = {},
  onSubmit = async (values) => {
    console.log(values)
  }
}) => {
  return (
    <Formik
      initialValues={{ name: '', ...defaultValues }}
      onSubmit={async (values) => {
        await onSubmit(values).then(console.log).catch(console.error)
      }}
    >
      {({ handleSubmit }) => (
        <View style={styles.form}>
          {/* <View style={styles.input}>
            <FormikInputValue name={'name'} disabled placeholder="Nombre" />
          </View>

          <View style={styles.input}>
            <FormikInputValue name={'phone'} disabled placeholder="Telefono" />
          </View>

          <View style={styles.input}>
            <FormikInputValue name={'email'} disabled placeholder="Correo" />
          </View> */}

          <View style={styles.input}>
            <FormikInputValue name={'position'} placeholder="Puesto" />
          </View>
          <View style={styles.input}>
            <Button onPress={handleSubmit} label={'Guardar'} />
          </View>
        </View>
      )}
    </Formik>
  )
}

export default FormStaff

const styles = StyleSheet.create({
  form: {
    padding: 0
  },
  input: {
    marginVertical: 10
  }
})
