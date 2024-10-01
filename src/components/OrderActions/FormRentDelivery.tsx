import { View } from 'react-native'
import React, { useEffect } from 'react'
import { Formik } from 'formik'
import FormikInputValue from '../FormikInputValue'
import InputLocationFormik from '../InputLocationFormik'
import OrderType from '../../types/OrderType'
import Button from '../Button'
import FormikInputImage from '../FormikInputImage'
import FormikSelectCategories from '../FormikSelectCategories'
import { getOrderFields } from '../FormOrder'
import { useOrderDetails } from '../../contexts/orderContext'
import { useStore } from '../../contexts/storeContext'
import InputSignUp from '../InputSignature'
import FormikInputSignature from '../FormikInputSignature'

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
  const { order } = useOrderDetails()
  const [loading, setLoading] = React.useState(false)

  const { store } = useStore()
  const orderFields = store?.orderFields?.[order?.type]
  const ORDER_FIELDS = getOrderFields({
    ...orderFields
  })
  console.log({ ORDER_FIELDS })

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
        {({ handleSubmit, dirty, values }) => {
          useEffect(() => {
            setDirty?.(dirty)
          }, [dirty])
          console.log({ values })

          const disabledUpdate = loading || !dirty
          return (
            <>
              {ORDER_FIELDS.includes('selectItems') && (
                <View style={{ marginVertical: 8 }}>
                  <FormikSelectCategories name="items" selectPrice />
                </View>
              )}
              {ORDER_FIELDS.includes('note') && (
                <FormikInputValue name="note" label="Contrato" />
              )}
              {ORDER_FIELDS.includes('address') && (
                <FormikInputValue name="address" label="Dirección" />
              )}
              {ORDER_FIELDS.includes('references') && (
                <FormikInputValue
                  name="references"
                  label="Referencias de la casa"
                />
              )}
              {ORDER_FIELDS.includes('location') && (
                <InputLocationFormik name="location" />
              )}
              {ORDER_FIELDS.includes('imageID') && (
                <View style={{ marginVertical: 8 }}>
                  <FormikInputImage
                    name="imageID"
                    label="Subir identificación"
                  />
                </View>
              )}
              {ORDER_FIELDS.includes('imageHouse') && (
                <View style={{ marginVertical: 8 }}>
                  <FormikInputImage name="imageHouse" label="Subir fachada " />
                </View>
              )}
              {ORDER_FIELDS.includes('signature') && (
                <View style={{ marginVertical: 8 }}>
                  <FormikInputSignature name="signature" />
                </View>
              )}

              <Button
                buttonStyles={{ marginVertical: 12 }}
                label="Actualizar"
                disabled={disabledUpdate}
                variant={disabledUpdate ? 'ghost' : 'filled'}
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
