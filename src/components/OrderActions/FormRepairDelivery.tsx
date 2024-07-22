import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import FormikInputValue from '../FormikInputValue'
import InputLocationFormik from '../InputLocationFormik'
import OrderType from '../../types/OrderType'
import Button from '../Button'

const FormRepairDelivery = ({
  initialValues,
  onSubmit
}: {
  initialValues: Pick<OrderType, 'address' | 'location' | 'references'>
  onSubmit: (values) => Promise<void> | void
}) => {
  const [loading, setLoading] = React.useState(false)

  return (
    <View>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { resetForm }) => {
          setLoading(true)
          try {
            await onSubmit(values)
            resetForm({ values: values }) // Restablece el formulario a los valores iniciales
          } catch (error) {
            // Manejo de errores, si es necesario
          } finally {
            setLoading(false)
          }
        }}
      >
        {({ handleSubmit, dirty }) => (
          <>
            <FormikInputValue name="address" label="Dirección" />
            <FormikInputValue
              name="references"
              label="Referencias de la casa"
            />
            <InputLocationFormik name="Location" />
            <Button
              buttonStyles={{ marginVertical: 12 }}
              label="Actualizar "
              disabled={loading || !dirty}
              onPress={handleSubmit}
            ></Button>
          </>
        )}
      </Formik>
    </View>
  )
}

export default FormRepairDelivery

const styles = StyleSheet.create({})
