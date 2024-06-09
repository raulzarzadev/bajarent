import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Formik } from 'formik'
import FormikSelectCategories from './FormikSelectCategories'
import Button from './Button'
import DateCell from './DateCell'
import OrderType from '../types/OrderType'
import { expireDate2 } from '../libs/expireDate'
import InputCheckbox from './InputCheckbox'
import StyledModal from './StyledModal'
import FormPayment from './FormPayment'
import useModal from '../hooks/useModal'
import PaymentType from '../types/PaymentType'
import { onExtend_V2, onPay } from '../libs/order-actions'
import { useNavigation } from '@react-navigation/native'

const FormOrderRenew = ({ order }: { order: OrderType }) => {
  const { goBack } = useNavigation()
  const items = order?.items || []
  const [payment, setPayment] = useState<Partial<PaymentType>>({
    method: 'cash',
    amount: 0
  })
  const [newItems, setNewItems] = useState<OrderType['items']>(items)
  const [submitting, setSubmitting] = useState(false)
  const onSubmit = async (values: { items: OrderType['items'] }) => {
    if (addPay) {
      console.log('open modal')
      setNewItems(values.items)
      const amount = values.items.reduce((acc, item) => {
        return acc + (item?.priceSelected?.amount || 0)
      }, 0)
      setPayment({ ...payment, amount })
      modalPayment.toggleOpen()
    } else {
      // await ServiceOrders.update(order.id, { items: values.items })
      console.log('just renew')
      setSubmitting(true)
      await onExtend({
        items: values.items,
        time: values.items[0].priceSelected.time,
        startAt: order.expireAt,
        orderId: order.id
      })
        .then((res) => {
          console.log({ res })
          goBack()
        })
        .catch((err) => {
          console.log({ err })
        })
        .finally(() => {
          setSubmitting(false)
        })
    }
  }
  const onExtend = async ({ items, time, startAt, orderId }) => {
    await onExtend_V2({
      orderId,
      reason: 'renew',
      time, //TODO: this should be the shrotest time?
      startAt,
      items
    })
  }
  const [addPay, setAddPay] = useState(true)
  const modalPayment = useModal({ title: 'Pago de renovación' })
  const handleSubmitPayment = async ({ payment }) => {
    console.log('first save the renew')
    await onExtend({
      items: newItems,
      time: newItems[0].priceSelected.time,
      startAt: order.expireAt,
      orderId: order.id
    })
      .then(console.log)
      .catch(console.error)
    await onPay({
      storeId: order.storeId,
      orderId: order.id,
      payment
    })
      .then(console.log)
      .catch(console.error)
      .finally(() => {
        goBack()
        modalPayment.toggleOpen()
        setSubmitting(false)
      })
  }
  return (
    <View>
      <Formik
        initialValues={{ items }}
        onSubmit={(values) => {
          onSubmit(values)
        }}
      >
        {({ handleSubmit, values }) => (
          <View>
            <FormikSelectCategories
              name="items"
              selectPrice
              label="Articulos"
            />

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-around' }}
            >
              {/* <DateCell label="Fecha de vencimiento" date={order.expireAt} /> */}
              {values?.items?.[0]?.priceSelected && (
                <DateCell
                  label="NUEVA Fecha de vencimiento "
                  date={expireDate2({
                    startedAt: order?.expireAt,
                    price: values?.items?.[0]?.priceSelected
                  })}
                />
              )}
            </View>

            <View style={{ marginVertical: 8 }}>
              <InputCheckbox
                label="Agrega pago"
                value={addPay}
                setValue={() => {
                  setAddPay(!addPay)
                }}
              />
            </View>
            <Button
              disabled={submitting}
              onPress={() => {
                handleSubmit()
              }}
              label="Renovar"
            />
          </View>
        )}
      </Formik>
      <StyledModal {...modalPayment}>
        <FormPayment
          onSubmit={async (value) => {
            return await handleSubmitPayment({ payment: value })
          }}
          values={payment}
        />
      </StyledModal>
    </View>
  )
}

export default FormOrderRenew

const styles = StyleSheet.create({})
