import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import FormikInputValue from './InputValueFormik'
import Button from './Button'
import StoreType from '../types/StoreType'
import { order_type } from '../types/OrderType'
import dictionary from '../dictionary'
import FormikCheckbox from './FormikCheckbox'
import { gStyles } from '../styles'

const FormStore = ({
  defaultValues,
  onSubmit = async (values) => {
    console.log(values)
  }
}: {
  defaultValues?: Partial<StoreType>
  onSubmit?: (values: Partial<StoreType>) => Promise<any>
}) => {
  const [submitting, setSubmitting] = React.useState(false)
  const handleSubmit = async (values: Partial<StoreType>) => {
    setSubmitting(true)
    return await onSubmit(values)
      .then(console.log)
      .catch(() => {
        setSubmitting(false)
      })
  }
  const ordersTypes = Object.keys(order_type)
  return (
    <Formik
      initialValues={{ name: '', ...defaultValues }}
      onSubmit={async (values) => {
        handleSubmit(values)
      }}
    >
      {({ handleSubmit }) => (
        <View>
          <View style={styles.input}>
            <FormikInputValue name={'name'} placeholder="Nombre" />
          </View>
          <View style={styles.input}>
            <FormikInputValue name={'description'} placeholder="Descripción" />
          </View>

          <Text style={gStyles.h3}>Tipo de ordenes</Text>
          <View style={[styles.input, styles.type]}>
            {ordersTypes.map((type) => (
              <View key={type} style={[styles.type]}>
                <FormikCheckbox
                  name={'orderTypes.' + type}
                  label={dictionary(type as order_type)}
                />
              </View>
            ))}
          </View>

          <View style={styles.input}>
            <Button
              disabled={submitting}
              onPress={handleSubmit}
              label={'Guardar'}
            />
          </View>
        </View>
      )}
    </Formik>
  )
}

export default FormStore

const styles = StyleSheet.create({
  input: {
    marginVertical: 10
  },
  type: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: 4
  }
})
