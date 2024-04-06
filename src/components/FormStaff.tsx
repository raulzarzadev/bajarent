import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import FormikInputValue from './InputValueFormik'
import Button from './Button'
import FormikCheckbox from './FormikCheckbox'
import H1 from './H1'
import { staff_permissions } from '../types/StaffType'
import dictionary from '../dictionary'

const FormStaff = ({
  defaultValues = {},
  onSubmit = async (values) => {
    console.log(values)
  }
}) => {
  const permissions = Object.keys(staff_permissions)
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
          <View></View>
          <H1>Permisos</H1>
          <View style={[styles.input, styles.permissions]}>
            {permissions.map((permission) => (
              <View key={permission} style={[styles.permission]}>
                <FormikCheckbox
                  name={permission}
                  label={dictionary(permission as staff_permissions)}
                />
              </View>
            ))}
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
