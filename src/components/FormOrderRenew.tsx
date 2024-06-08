import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import FormikSelectCategories from './FormikSelectCategories'
import Button from './Button'
import DateCell from './DateCell'
import OrderType from '../types/OrderType'
import { expireDate2 } from '../libs/expireDate'

const FormOrderRenew = ({ order }: { order: OrderType }) => {
  const items = order?.items || []

  const onSubmit = (values) => {
    console.log({ values })
  }

  return (
    <View>
      <Formik
        initialValues={{ items }}
        onSubmit={(values) => {
          console.log({ values })
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
              <DateCell label="Fecha de vencimiento" date={order.expireAt} />
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

            <View>
              <Text>Renovar</Text>
            </View>
            <Button
              onPress={() => {
                handleSubmit()
              }}
            >
              Renovar
            </Button>
          </View>
        )}
      </Formik>
    </View>
  )
}

export default FormOrderRenew

const styles = StyleSheet.create({})
