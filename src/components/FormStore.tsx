import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import theme from '../theme'
import FormikInputValue from './FormikInputValue'
import Button from './Button'

const FormStore = ({
  onSubmit = async (values) => {
    console.log(values)
  }
}) => {
  return (
    <Formik
      initialValues={{ name: '' }}
      onSubmit={async (values) => {
        await onSubmit(values).then(console.log).catch(console.error)
      }}
    >
      {({ handleSubmit }) => (
        <View style={styles.form}>
          <FormikInputValue name={'name'} placeholder="Nombre" />
          <Button onPress={handleSubmit} label={'Guardar'} />
        </View>
      )}
    </Formik>
  )
}

export default FormStore

const styles = StyleSheet.create({
  form: {
    padding: theme.padding.md
  }
})
