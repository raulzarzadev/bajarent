import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Formik, useField } from 'formik'
import StyledButton from './StyledButton'
import theme from './theme'
import FormikInputValue from './FormikInputValue'

const FormOrder = ({
  onSubmit = async (values) => {
    console.log(values)
  }
}) => {
  return (
    <Formik
      initialValues={{ email: '', userName: '' }}
      onSubmit={async (values) => {
        onSubmit(values).then(console.log).catch(console.error)
      }}
    >
      {({ handleSubmit }) => (
        <View style={styles.form}>
          <FormikInputValue name={'userName'} placeholder="Nombre" />
          <FormikInputValue name={'phone'} placeholder="Teléfono" />
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

export default FormOrder

const styles = StyleSheet.create({
  form: {
    padding: theme.padding.md
  }
})
