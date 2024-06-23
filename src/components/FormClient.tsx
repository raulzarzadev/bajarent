import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import FormikInputValue from './FormikInputValue'
import FormikInputPhone, { FormikInputPhoneE } from './FormikInputPhone'
import { ClientType } from '../types/ClientType'
import Button from './Button'
import ErrorBoundary from './ErrorBoundary'

const FormClient = ({ client }: { client: Partial<ClientType> }) => {
  const clientDefault: Partial<ClientType> = {
    name: '',
    phone: '',
    neighborhood: '',
    address: '',
    ...client
  }
  return (
    <View>
      <Formik
        onSubmit={(values) => {
          console.log(values)
        }}
        initialValues={clientDefault}
      >
        {({ handleSubmit }) => {
          return (
            <View>
              <FormikInputValue name="name" label="Nombre" />
              <FormikInputPhoneE name="phone" label="Teléfono" />
              <FormikInputValue name="neighborhood" label="Colonia" />
              <FormikInputValue name="address" label="Dirección" />
              <Button
                label="Guardar"
                onPress={() => {
                  handleSubmit()
                }}
              ></Button>
            </View>
          )
        }}
      </Formik>
    </View>
  )
}

export const FormClientE = (props) => (
  <ErrorBoundary componentName="FormClient">
    <FormClient {...props} />
  </ErrorBoundary>
)

export default FormClient

const styles = StyleSheet.create({})
