import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import FormikInputValue from './FormikInputValue'
import Button from './Button'
import { OrderQuoteType } from '../types/OrderType'

const FormQuote = ({
  quote,
  onSubmit
}: {
  quote?: OrderQuoteType
  onSubmit: (values: OrderQuoteType) => void
}) => {
  return (
    <View>
      <Formik
        onSubmit={onSubmit}
        initialValues={quote || { description: '', amount: 0 }}
      >
        {({ handleSubmit }) => (
          <View style={{ flexDirection: 'row' }}>
            <FormikInputValue
              name="description"
              placeholder="Descripción "
              containerStyle={{ flex: 1 }}
            />
            <FormikInputValue
              name="amount"
              placeholder="Monto "
              type="number"
              inputStyle={{ width: 100 }}
            />
            <Button onPress={handleSubmit} icon="add" size="xs" />
          </View>
        )}
      </Formik>
    </View>
  )
}

export default FormQuote

const styles = StyleSheet.create({})
