import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik, useField } from 'formik'
import StyledTextInput from './StyledTextInput'
import StyledButton from './StyledButton'
import theme from './theme'

const OrderForm = () => {
  return (
    <Formik
      initialValues={{ email: '', userName: '' }}
      onSubmit={(values) => console.log(values)}
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

const FormikInputValue = ({ name, ...props }) => {
  const [field, meta, helpers] = useField(name)
  return (
    <StyledTextInput
      value={field.value}
      onChangeText={helpers.setValue}
      {...props}
    />
  )
}

export default OrderForm

const styles = StyleSheet.create({
  form: {
    padding: theme.padding.md
  }
})
