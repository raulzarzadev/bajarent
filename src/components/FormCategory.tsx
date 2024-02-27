import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import FormikInputValue from './InputValueFormik'
import Button from './Button'

import { CategoryType } from '../types/RentItem'

const FormCategory = ({
  defaultValues = {},
  onSubmit = async (values) => {
    console.log(values)
  }
}: {
  defaultValues?: Partial<CategoryType>
  onSubmit?: (values: Partial<CategoryType>) => Promise<any>
}) => {
  // @ts-ignore

  const [sending, setSending] = React.useState(false)

  return (
    <Formik
      initialValues={{ name: '', ...defaultValues }}
      onSubmit={async (values) => {
        setSending(true)
        await onSubmit?.(values).then(console.log).catch(console.error)
        setTimeout(() => {
          setSending(false)
        }, 1000)
      }}
    >
      {({ handleSubmit }) => (
        <View style={styles.form}>
          <View style={styles.input}>
            <FormikInputValue name={'name'} placeholder="Nombre" />
          </View>
          <View style={styles.input}>
            <FormikInputValue name={'description'} placeholder="Descripción" />
          </View>

          <View style={styles.input}>
            <Button
              onPress={handleSubmit}
              label={'Guardar'}
              disabled={sending}
            />
          </View>
        </View>
      )}
    </Formik>
  )
}

export default FormCategory
const styles = StyleSheet.create({
  form: {
    padding: 0
  },
  input: {
    marginVertical: 10
  },
  permissions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  permission: {
    margin: 2,
    marginVertical: 8
  }
})
