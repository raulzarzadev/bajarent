import { View } from 'react-native'
import React, { useEffect } from 'react'
import { Formik } from 'formik'
import FormikInputValue from '../FormikInputValue'
import InputLocationFormik from '../InputLocationFormik'
import OrderType from '../../types/OrderType'
import Button from '../Button'
import FormikInputImage from '../FormikInputImage'
import FormikSelectCategories, {
  FormikSelectCategoriesE
} from '../FormikSelectCategories'
import { getOrderFields } from '../FormOrder'
import { useOrderDetails } from '../../contexts/orderContext'
import { useStore } from '../../contexts/storeContext'
import FormikInputSignature from '../FormikInputSignature'
import FormikErrorsList, { ErrorsList } from '../FormikErrorsList'

const FormRentDelivery = ({
  initialValues,
  onSubmit,
  setDirty,
  submitLabel = 'Actualizar'
}: {
  initialValues: Pick<
    OrderType,
    'address' | 'location' | 'references' | 'imageID' | 'imageHouse'
  >
  onSubmit: (values) => Promise<void> | void
  setDirty?: (dirty: boolean) => void
  submitLabel?: string
}) => {
  const { order } = useOrderDetails()
  const [loading, setLoading] = React.useState(false)

  const { store } = useStore()
  const orderFields = store?.orderFields?.[order?.type]
  const ORDER_FIELDS = getOrderFields({
    ...orderFields
  })

  return (
    <View>
      <Formik
        validate={(values) => {
          const errors: any = {}

          //* TODO validate fields from store configuration (orderFields)

          // if (ORDER_FIELDS.includes('imageID')) {
          //   if (!values.imageID) {
          //     errors.items = 'Debes agregar una imagen del ID'
          //   }
          // }
          return errors
        }}
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

          const disabledUpdate = loading || !dirty
          return (
            <>
              {ORDER_FIELDS.includes('selectItems') && (
                <View style={{ marginVertical: 8 }}>
                  <FormikSelectCategoriesE name="items" selectPrice />
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
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
              >
                {ORDER_FIELDS.includes('imageID') && (
                  <View style={{ marginVertical: 8, width: 100 }}>
                    <FormikInputImage name="imageID" label="ID" />
                  </View>
                )}
                {ORDER_FIELDS.includes('imageHouse') && (
                  <View style={{ marginVertical: 8, width: 100 }}>
                    <FormikInputImage name="imageHouse" label="Casa" />
                  </View>
                )}
                {ORDER_FIELDS.includes('signature') && (
                  <View style={{ marginVertical: 8, width: 100 }}>
                    <FormikInputSignature name="signature" />
                  </View>
                )}
              </View>

              <FormikErrorsList />

              <Button
                buttonStyles={{ marginVertical: 12 }}
                label={submitLabel}
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
