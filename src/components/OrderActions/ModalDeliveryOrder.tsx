import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import StyledModal from '../StyledModal'
import useModal from '../../hooks/useModal'
import OrderType from '../../types/OrderType'
import InputLocationFormik from '../InputLocationFormik'
import FormikInputValue from '../FormikInputValue'
import FormikInputImage from '../FormikInputImage'
import FormikSelectCategories from '../FormikSelectCategories'
import { gStyles } from '../../styles'
import Button from '../Button'

const ModalDeliveryOrder = ({
  order,
  deliveryModal
}: {
  order: Partial<OrderType>
  deliveryModal: ReturnType<typeof useModal>
}) => {
  const itemSerial = order?.items?.[0]?.serial || ''
  console.log({ itemSerial })
  const handleDeliveryOrder = async (values) => {
    const itemBrand = values.itemBrand || ''
    const itemsWithOrderSerialNumber = values.items.map((item) => {
      return { ...item, serial: itemSerial, brand: itemBrand || '' }
    })
    // await onRentItems({ items: itemsWithOrderSerialNumber })

    // await actions_fns[acts.DELIVER]({
    //   ...values
    // })
  }
  return (
    <View>
      <StyledModal {...deliveryModal}>
        <Formik
          initialValues={{ ...order, itemSerial }}
          onSubmit={async (values) => {
            handleDeliveryOrder(values)
          }}
          validate={(values: OrderType) => {
            const errors: Partial<OrderType> = {}
            if (!values.location) errors.location = 'Ubicación requerida'
            if (
              !values.itemSerial &&
              (values.type === 'RENT' || values.type === 'REPAIR')
            )
              errors.itemSerial = 'No. de serie es requerido'
            return errors
          }}
        >
          {({ errors, handleSubmit, isSubmitting }) => {
            return (
              <View>
                <View style={{ marginVertical: 8 }}>
                  <FormikInputValue
                    name={'note'}
                    placeholder="Nota"
                    helperText={'Numero de nota o referencia externa'}
                  />
                </View>
                <View style={{ marginVertical: 8 }}>
                  <FormikInputValue
                    name={'itemSerial'}
                    placeholder="No. de serie"
                    helperText={'Numero de serie'}
                  />
                </View>
                <View style={{ marginVertical: 8 }}>
                  <InputLocationFormik
                    name={'location'}
                    helperText={'Ubicación con link o coordenadas'}
                  />
                </View>
                <View style={{ marginVertical: 8 }}>
                  <FormikInputImage
                    name="imageID"
                    label="Subir identificación"
                  />
                </View>

                <View style={{ marginVertical: 8 }}>
                  <FormikInputImage name="imageHouse" label="Subir fachada " />
                </View>

                <View style={{ marginVertical: 8 }}>
                  <FormikSelectCategories name="items" selectPrice />
                </View>

                {Object.entries(errors).map(([field, message]) => (
                  <Text key={field} style={gStyles.helperError}>
                    *{message as string}
                  </Text>
                ))}

                <Button
                  disabled={Object.keys(errors).length > 0 || isSubmitting}
                  label="Entregar"
                  onPress={() => {
                    handleSubmit()
                  }}
                />
              </View>
            )
          }}
        </Formik>
      </StyledModal>
    </View>
  )
}

export default ModalDeliveryOrder

const styles = StyleSheet.create({})
