import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import FormikInputValue from './FormikInputValue'
import Button from './Button'
import { QuoteType } from './ListOrderQuotes'

const FormQuote = ({
  quote,
  onSubmit
}: {
  quote: { description: string; amount: number }
  onSubmit: (values: QuoteType) => void
}) => {
  return (
    <View>
      <Formik onSubmit={onSubmit} initialValues={quote}>
        {({ handleSubmit }) => (
          <View style={{ flexDirection: 'row' }}>
            <FormikInputValue
              name="description"
              placeholder="Descripción "
              inputStyle={{ flex: 1 }}
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
