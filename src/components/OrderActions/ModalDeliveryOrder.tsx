import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import StyledModal from '../StyledModal'
import useModal from '../../hooks/useModal'
import OrderType from '../../types/OrderType'
import InputLocationFormik from '../InputLocationFormik'
import FormikInputValue from '../FormikInputValue'
import FormikInputImage from '../FormikInputImage'
import FormikSelectCategories, {
  FormikSelectCategoriesE
} from '../FormikSelectCategories'
import { gStyles } from '../../styles'
import Button from '../Button'
import { onComment, onDelivery } from '../../libs/order-actions'
import { useAuth } from '../../contexts/authContext'
import { orderExpireAt } from '../../libs/orders'
import {
  onRegistryEntry,
  onRentItem
} from '../../firebase/actions/item-actions'
import { useStore } from '../../contexts/storeContext'

const ModalDeliveryOrder = ({
  order,
  deliveryModal
}: {
  order: Partial<OrderType>
  deliveryModal: ReturnType<typeof useModal>
}) => {
  const { user } = useAuth()
  const { storeId } = useStore()

  const handleDeliveryOrder = async (values: Partial<OrderType>) => {
    deliveryModal.toggleOpen()

    const expireAt = orderExpireAt({
      order: { ...values, deliveredAt: new Date() }
    })
    //* delivery order
    onDelivery({
      expireAt,
      orderId: values.id,
      userId: user.id,
      items: values.items,
      order: values
    })
      .then((r) => console.log(r))
      .catch((e) => console.error(e))

    //* delivery items
    values.items.forEach((item) => {
      onRentItem({
        storeId: values.storeId,
        itemId: item.id,
        orderId: values.id
      })
        .then((r) => console.log(r))
        .catch((e) => console.error(e))

      onRegistryEntry({
        storeId,
        itemId: item?.id,
        type: 'delivery',
        orderId: order?.id
      })
        .then((r) => console.log(r))
        .catch((e) => console.error(e))
    })

    //* create movement
    await onComment({
      orderId: order.id,
      content: 'Entregada',
      storeId,
      type: 'comment'
    })
      .then((r) => console.log(r))
      .catch((e) => console.error(e))
  }
  const correctQtyOfItems = (items = []) => {
    return true
    const MAX_ITEMS = 1
    const MIN_ITEMS = 1
    return items.length > MAX_ITEMS || items.length < MIN_ITEMS
  }
  // order.itemSerial = itemSerial || ''
  return (
    <View>
      <StyledModal {...deliveryModal}>
        <Formik
          initialValues={{ ...order }}
          onSubmit={async (values) => {
            handleDeliveryOrder(values)
          }}
          validate={(values: OrderType) => {
            const errors: Partial<OrderType> = {}
            if (!values.location) errors.location = 'Ubicación requerida'

            return errors
          }}
        >
          {({ errors, handleSubmit, isSubmitting, values }) => {
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
                  <FormikSelectCategoriesE name="items" selectPrice />
                </View>

                {Object.entries(errors).map(([field, message]) => (
                  <Text key={field} style={gStyles.helperError}>
                    *{message as string}
                  </Text>
                ))}
                {!correctQtyOfItems(values?.items || []) && (
                  <Text style={gStyles.helperError}>
                    *Es necesario al menos un artículo
                  </Text>
                )}

                <Button
                  disabled={
                    Object.keys(errors).length > 0 ||
                    isSubmitting ||
                    !correctQtyOfItems(values?.items || [])
                  }
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
