import { View } from 'react-native'
import React, { useEffect } from 'react'
import { Formik } from 'formik'
import FormikInputValue from '../FormikInputValue'
import InputLocationFormik from '../InputLocationFormik'
import OrderType from '../../types/OrderType'
import Button from '../Button'
import FormikInputImage from '../FormikInputImage'
import FormikSelectCategories from '../FormikSelectCategories'

const FormRentDelivery = ({
  initialValues,
  onSubmit,
  setDirty
}: {
  initialValues: Pick<
    OrderType,
    'address' | 'location' | 'references' | 'imageID' | 'imageHouse'
  >
  onSubmit: (values) => Promise<void> | void
  setDirty?: (dirty: boolean) => void
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
        {({ handleSubmit, dirty }) => {
          useEffect(() => {
            setDirty?.(dirty)
          }, [dirty])
          return (
            <>
              <View style={{ marginVertical: 8 }}>
                <FormikSelectCategories name="items" selectPrice />
              </View>
              <FormikInputValue name="note" label="Contrato" />
              <FormikInputValue name="address" label="Dirección" />
              <FormikInputValue
                name="references"
                label="Referencias de la casa"
              />
              <InputLocationFormik name="location" />
              <View style={{ marginVertical: 8 }}>
                <FormikInputImage name="imageID" label="Subir identificación" />
              </View>

              <View style={{ marginVertical: 8 }}>
                <FormikInputImage name="imageHouse" label="Subir fachada " />
              </View>

              <Button
                buttonStyles={{ marginVertical: 12 }}
                label="Actualizar"
                disabled={loading || !dirty}
                onPress={handleSubmit}
              ></Button>
            </>
          )
        }}
      </Formik>
    </View>
  )
}

export default FormRentDelivery
