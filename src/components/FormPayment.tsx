import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import InputRadiosFormik from './FormikInputRadios'
import PaymentType, { payment_methods } from '../types/PaymentType'
import dictionary from '../dictionary'
import Button from './Button'
import FormikInputValue from './FormikInputValue'
import FormikInputImage from './FormikInputImage'
import { gStyles } from '../styles'

const FormPayment = ({
  onSubmit,
  values
}: {
  onSubmit: (values: Partial<PaymentType>) => Promise<any> | void
  values?: Partial<PaymentType>
}) => {
  const initialValues: Partial<PaymentType> = {
    method: values?.method || 'cash',
    amount: values?.amount || 0,
    reference: values?.reference || '',
    ...values
  }
  const methods = Object.values(payment_methods).map((method) => ({
    label:
      dictionary(method).charAt(0).toUpperCase() + dictionary(method).slice(1),
    value: method
  }))
  const [submitting, setSubmitting] = React.useState(false)
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values) => {
        setSubmitting(true)
        await onSubmit(values)
        setSubmitting(false)
        return
      }}
      validate={(values) => {
        const errors: Partial<PaymentType> = {}
        if (!values.amount) {
          // @ts-ignore
          errors.amount = 'Ingresa un monto'
        }
        if (values.method === 'transfer' && !values.reference) {
          errors.reference = 'Registra una referencia'
        }
        return errors
      }}
    >
      {({ handleSubmit, values, isSubmitting, setSubmitting, errors }) => {
        return (
          <>
            <View style={styles.repairItemForm}>
              <InputRadiosFormik options={methods} name="method" />
            </View>

            <View style={styles.repairItemForm}>
              <FormikInputValue
                type="number"
                name="amount"
                keyboardType="numeric"
                placeholder="Total $ "
              />
            </View>
            {values.method === 'transfer' && (
              <View style={styles.repairItemForm}>
                <FormikInputValue name="reference" placeholder="Referencia" />
                <FormikInputImage
                  name="image"
                  onUploading={(progress) => {
                    setSubmitting(progress < 100)
                  }}
                />
              </View>
            )}
            {Object.entries(errors).map(([field, message]) => (
              <Text
                key={field}
                style={[gStyles.helperError, { textAlign: 'center' }]}
              >
                *{message as string}
              </Text>
            ))}
            <View style={styles.repairItemForm}>
              <Button
                disabled={submitting || isSubmitting}
                onPress={async () => {
                  handleSubmit()
                }}
                color="success"
              >
                {'Pagar'}
              </Button>
            </View>
          </>
        )
      }}
    </Formik>
  )
}

export default FormPayment

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  item: {
    width: '48%', // for 2 items in a row
    marginVertical: '1%' // spacing between items
  },
  repairItemForm: {
    marginVertical: 4
  }
})
