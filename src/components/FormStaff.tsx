import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import FormikInputValue from './InputValueFormik'
import Button from './Button'
import { useStore } from '../contexts/storeContext'
import { gStyles } from '../styles'

const FormStaff = ({
  defaultValues = {},
  onSubmit = async (values) => {
    console.log(values)
  }
}: {
  defaultValues?: {
    userId?: string
    position?: string
    name?: string
  }
  onSubmit?: (values: any) => Promise<void>
}) => {
  const { staff } = useStore()
  const alreadyAreStaff = staff.find((s) => s.userId === defaultValues.userId)

  if (alreadyAreStaff)
    return (
      <Text style={[gStyles.h3, { marginVertical: 8 }]}>
        Este usuario ya es parte de tu staff
      </Text>
    )

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
            <FormikInputValue
              name={'position'}
              placeholder="Puesto"
              helperText="Nombre, referencia o puesto que desempeñara"
            />
          </View>

          <View style={styles.input}>
            <Button
              onPress={handleSubmit}
              label={'Guardar'}
              disabled={!!alreadyAreStaff}
            />
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
