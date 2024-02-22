import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import FormikInputValue from './InputValueFormik'
import Button from './Button'
import usePrices from '../hooks/usePrices'
import { gStyles } from '../styles'
import ModalFormPrice from './ModalFormPrice'
import { PriceType } from '../types/PriceType'
import { useStore } from '../contexts/storeContext'
import { CardPrice } from './FormSelectItem'

const FormCategory = ({
  defaultValues = {},
  onSubmit = async (values) => {
    console.log(values)
  }
}) => {
  // @ts-ignore
  const categoryId = defaultValues?.id
  const [sending, setSending] = React.useState(false)
  const { createPrice } = usePrices()
  const { prices, storeId } = useStore()
  const categoryPrices = prices.filter(
    (price: PriceType) => price.categoryId === categoryId
  )

  return (
    <Formik
      initialValues={{ name: '', ...defaultValues }}
      onSubmit={async (values) => {
        setSending(true)
        await onSubmit(values).then(console.log).catch(console.error)
        setTimeout(() => {
          setSending(false)
        }, 1000)
      }}
    >
      {({ handleSubmit }) => (
        <View style={styles.form}>
          <View style={styles.input}>
            <FormikInputValue name={'name'} placeholder="Nombre" />
          </View>
          <View style={styles.input}>
            <FormikInputValue name={'description'} placeholder="Descripción" />
          </View>

          <View
            style={[
              styles.input,
              { flexDirection: 'row', alignItems: 'center' }
            ]}
          >
            <Text style={[gStyles.h3, { marginRight: 8 }]}>Precios</Text>
            <ModalFormPrice
              handleSubmit={async (price) => {
                return await createPrice(price, storeId, categoryId)
              }}
            />
          </View>
          <View style={styles.input}>
            <FlatList
              horizontal
              data={categoryPrices}
              renderItem={({ item }) => (
                <CardPrice
                  style={{ marginVertical: 8, marginRight: 8 }}
                  price={item}
                />
              )}
            ></FlatList>
          </View>

          <View style={styles.input}>
            <Button
              onPress={handleSubmit}
              label={'Guardar'}
              disabled={sending}
            />
          </View>
        </View>
      )}
    </Formik>
  )
}

export default FormCategory
const styles = StyleSheet.create({
  form: {
    padding: 0
  },
  input: {
    marginVertical: 10
  },
  permissions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  permission: {
    margin: 2,
    marginVertical: 8
  }
})
