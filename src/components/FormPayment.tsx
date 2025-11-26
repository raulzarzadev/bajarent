import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import InputRadiosFormik from './FormikInputRadios'
import PaymentType, { payment_methods } from '../types/PaymentType'
import dictionary from '../dictionary'
import Button from './Button'
import FormikInputValue from './FormikInputValue'
import FormikInputImage from './FormikInputImage'
import FormikErrorsList from './FormikErrorsList'
import { useEmployee } from '../contexts/employeeContext'
import FormikInputSelect from './FormikInputSelect'
import { useStore } from '../contexts/storeContext'
import FormikInputDate from './FormikInputDate'

const FormPayment = ({
  onSubmit,
  values,
  disabledSubmit
}: {
  onSubmit: (values: Partial<PaymentType>) => Promise<any> | void
  values?: Partial<PaymentType>
  disabledSubmit?: boolean
}) => {
  const { store } = useStore()
  const { permissions } = useEmployee()
  const defaultAmount = values?.amount || 0
  const initialValues: Partial<PaymentType> = {
    ...values,
    method: values?.method || 'transfer',
    amount: 0,
    reference: values?.reference || '',
    date: values?.date || new Date()
  }

  const methods = Object.values(payment_methods).map((method) => ({
    label:
      dictionary(method).charAt(0).toUpperCase() + dictionary(method).slice(1),
    value: method
  }))
  const references = store?.bankAccounts?.map((account) => {
    const accountValue = account.value || ''
    const ref = `${account?.label} ${accountValue.substring(
      accountValue.length - 4
    )}`
    return {
      label: ref,
      value: ref
    }
  })

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
        if (values.method === 'transfer' && references.length === 0) {
          errors.reference = 'Debes registrar una cuenta bancaria en la tienda'
        }
        if (
          values.method === 'transfer' &&
          !values.image &&
          permissions?.orders?.shouldUploadTransferReceipt
        ) {
          errors.image = 'Agrega un comprobante'
        }
        return errors
      }}
    >
      {({ handleSubmit, values, isSubmitting, setSubmitting, errors }) => {
        const diffAmount = defaultAmount - values.amount
        // si es menor a 0, deberia decir, faltan $200, si es mayor $sobran y si es igual deberia decir la "la cantidad es correcta"

        const labelDiffAmount =
          diffAmount === 0
            ? 'La cantidad es correcta'
            : diffAmount > 0
            ? `Faltan $${diffAmount.toFixed(2)}`
            : `Sobran $${Math.abs(diffAmount).toFixed(2)}`
        return (
          <>
            <View style={styles.repairItemForm}>
              <InputRadiosFormik options={methods} name="method" />
            </View>

            <Text style={{}}>
              Confirmar cantidad: <Text>${defaultAmount.toFixed(2)}</Text>
            </Text>

            <View style={styles.repairItemForm}>
              <FormikInputValue
                type="number"
                name="amount"
                keyboardType="numeric"
                placeholder="$0.00 "
                helperText={labelDiffAmount}
                // helperText={`Confirmar cantidad: $${defaultAmount.toFixed(2)}`}
              />
            </View>
            {values.method === 'transfer' && (
              <View style={styles.repairItemForm}>
                {/* <FormikInputValue name="reference" placeholder="Referencia" /> */}
                <FormikInputSelect
                  options={references}
                  name="reference"
                  placeholder="Selecciona una cuenta"
                  helperText="Cuenta de depósito"
                />
                <FormikInputDate name="date" withTime />
                <FormikInputImage
                  name="image"
                  onUploading={(progress) => {
                    setSubmitting(progress < 100)
                  }}
                />
              </View>
            )}
            <FormikErrorsList />

            <View style={styles.repairItemForm}>
              <Button
                disabled={
                  submitting ||
                  isSubmitting ||
                  !!Object.keys(errors).length ||
                  disabledSubmit
                }
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
