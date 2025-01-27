import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { Formik } from 'formik'
import InputTextStyled from '../InputTextStyled'
import Button from '../Button'
const FormCustomer = (props?: FormCustomerProps) => {
  return (
    <View>
      <Formik
        initialValues={{ name: '', email: '' }}
        onSubmit={(values, actions) => {
          alert(JSON.stringify(values, null, 2))
          actions.setSubmitting(false)
        }}
      >
        {(formikProps) => (
          <View>
            <Text>Formik Form</Text>
            <InputTextStyled
              onChangeText={formikProps.handleChange('name')}
              onBlur={formikProps.handleBlur('name')}
              value={formikProps.values.name}
            />
            <InputTextStyled
              onChangeText={formikProps.handleChange('email')}
              onBlur={formikProps.handleBlur('email')}
              value={formikProps.values.email}
            />
            <Button onPress={formikProps.handleSubmit} label="Enviar" />
          </View>
        )}
      </Formik>
    </View>
  )
}
export default FormCustomer
export type FormCustomerProps = {}
export const FormCustomerE = (props: FormCustomerProps) => (
  <ErrorBoundary componentName="FormCustomer">
    <FormCustomer {...props} />
  </ErrorBoundary>
)
