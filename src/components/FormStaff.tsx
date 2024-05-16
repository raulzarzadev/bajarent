import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import FormikInputValue from './InputValueFormik'
import Button from './Button'
import ErrorBoundary from './ErrorBoundary'
import FormikCheckbox from './FormikCheckbox'
import dictionary from '../dictionary'
const screenWidth = Dimensions.get('window').width
import { permissionsOrderKeys, permissionsStoreKeys } from '../types/StaffType'
import { gStyles } from '../styles'
import FormEmployeeSections from './FormEmployeeSections'

const checkboxWidth = screenWidth > 500 ? '33%' : '50%'

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
    id?: string
  }
  onSubmit?: (values: any) => Promise<void>
}) => {
  const [loading, setLoading] = React.useState(false)
  return (
    <Formik
      initialValues={{ name: '', ...defaultValues }}
      onSubmit={async (values) => {
        try {
          setLoading(true)
          await onSubmit(values).then(console.log).catch(console.error)
        } catch (error) {
          console.error(error)
        } finally {
          setTimeout(() => {
            setLoading(false)
          }, 2000)
        }
      }}
    >
      {({ handleSubmit, isSubmitting, setSubmitting }) => (
        <View style={styles.form}>
          {/*
           *** *** *** INFORMATION
           */}
          <View style={styles.input}>
            <FormikInputValue
              name={'position'}
              placeholder="Puesto"
              helperText="Nombre, referencia o puesto que desempeñara"
            />
          </View>

          <FormEmployeeSections employeeId={defaultValues?.id} />

          {/*
           *** *** *** PERMISSIONS
           */}
          <Text>Permisos especiales</Text>
          <View>
            <FormikCheckbox
              style={{ width: checkboxWidth, marginVertical: 4 }}
              name={`permissions.isAdmin`}
              label={'Admin'}
            />

            <Text style={[gStyles.h3, { textAlign: 'left', marginTop: 12 }]}>
              Permisos de ordenes
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {permissionsOrderKeys.map((permission) => (
                <FormikCheckbox
                  style={{ width: checkboxWidth, marginVertical: 4 }}
                  key={permission}
                  name={`permissions.order.${permission}`}
                  label={dictionary(permission)}
                />
              ))}
            </View>
            <Text style={[gStyles.h3, { textAlign: 'left', marginTop: 12 }]}>
              Permisos de tienda
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {permissionsStoreKeys.map((permission) => (
                <FormikCheckbox
                  style={{ width: checkboxWidth, marginVertical: 4 }}
                  key={permission}
                  name={`permissions.store.${permission}`}
                  label={dictionary(permission)}
                />
              ))}
            </View>
          </View>

          <View style={styles.input}>
            <Button
              disabled={loading}
              label="Actualizar información"
              onPress={() => {
                handleSubmit()
              }}
            />
          </View>
        </View>
      )}
    </Formik>
  )
}

export const FormStaffE = (props) => (
  <ErrorBoundary componentName="FormStaff">
    <FormStaff {...props} />
  </ErrorBoundary>
)

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
