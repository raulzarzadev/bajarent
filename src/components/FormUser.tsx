import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import FormikInputValue from './InputValueFormik'
import Button from './Button'

const FormUser = ({
  defaultValues,
  onSubmit = async (values) => {
    console.log(values)
  }
}) => {
  console.log({ defaultValues })
  return (
    <Formik
      initialValues={{ name: '', ...defaultValues }}
      onSubmit={async (values) => {
        await onSubmit(values).then(console.log).catch(console.error)
      }}
    >
      {({ handleSubmit }) => (
        <View style={styles.form}>
          <View style={styles.input}>
            <FormikInputValue name={'name'} placeholder="Nombre" />
          </View>
          <View style={styles.input}>
            <FormikInputValue name={'phone'} placeholder="Telefono" disabled />
          </View>
          <View style={styles.input}>
            <FormikInputValue name={'email'} placeholder="Correo" />
          </View>
          <View style={styles.input}>
            <Button onPress={handleSubmit} label={'Guardar'} />
          </View>
        </View>
      )}
    </Formik>
  )
}

export default FormUser

const styles = StyleSheet.create({
  form: {
    padding: 10
  },
  input: {
    marginVertical: 10
  }
})
