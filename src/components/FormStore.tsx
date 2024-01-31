import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import FormikInputValue from './InputValueFormik'
import Button from './Button'
import StoreType from '../types/StoreType'

const FormStore = ({
  defaultValues,
  onSubmit = async (values) => {
    console.log(values)
  }
}: {
  defaultValues?: Partial<StoreType>
  onSubmit?: (values: Partial<StoreType>) => Promise<any>
}) => {
  const [submitting, setSubmitting] = React.useState(false)
  const handleSubmit = async (values: Partial<StoreType>) => {
    setSubmitting(true)
    return await onSubmit(values)
      .then(console.log)
      .catch(() => {
        setSubmitting(false)
      })
  }
  console.log({ submitting })
  return (
    <Formik
      initialValues={{ name: '', ...defaultValues }}
      onSubmit={async (values) => {
        handleSubmit(values)
      }}
    >
      {({ handleSubmit }) => (
        <View>
          <View style={styles.input}>
            <FormikInputValue name={'name'} placeholder="Nombre" />
          </View>
          <View style={styles.input}>
            <FormikInputValue name={'description'} placeholder="Descripción" />
          </View>
          <View style={styles.input}>
            <Button
              disabled={submitting}
              onPress={handleSubmit}
              label={'Guardar'}
            />
          </View>
        </View>
      )}
    </Formik>
  )
}

export default FormStore

const styles = StyleSheet.create({
  input: {
    marginVertical: 10
  }
})
