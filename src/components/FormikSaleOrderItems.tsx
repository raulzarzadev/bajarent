import { Dimensions, StyleSheet, Text, View } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
import { FieldArray, useFormikContext } from 'formik'
import FormikInputValue from './FormikInputValue'
import FormikInputSelect from './FormikInputSelect'
import { useStore } from '../contexts/storeContext'
import { SaleOrderItem } from '../types/OrderType'
import Button from './Button'
import CurrencyAmount from './CurrencyAmount'
import { orderAmount } from '../libs/order-amount'
import { gStyles } from '../styles'
import { useEffect, useState } from 'react'
const FormikSaleOrderItems = ({ name }: { name: string }) => {
  const layoutRow = Dimensions.get('window').width > 500

  const { values } = useFormikContext<{
    items: SaleOrderItem[]
  }>()
  const { categories } = useStore()
  const defaultValues = [
    {
      product: '',
      quantity: 1,
      price: 0,
      total: 0
    }
  ]

  const [saleCategories, setSaleCategories] = useState([])
  useEffect(() => {
    setSaleCategories(
      categories
        ?.filter((cat) => cat?.orderType?.sale)
        ?.map((cat) => {
          return { label: cat.name, value: cat.id }
        })
        ?.sort((a, b) => a.label.localeCompare(b.label))
    )
  }, [categories])
  return (
    <View>
      <FieldArray
        name={name}
        render={(arrayHelpers) => (
          <View>
            {values.items && values.items.length > 0 ? (
              values?.items?.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: layoutRow ? 'row' : 'column',
                    marginVertical: 6,
                    alignItems: 'center',
                    justifyContent: 'space-around'
                  }}
                >
                  <FormikInputSelect
                    style={{ width: 120, marginVertical: 4 }}
                    name={`items.${index}.category`}
                    placeholder="Categoria"
                    options={saleCategories}
                  />
                  <FormikInputValue
                    name={`items.${index}.serial`}
                    placeholder="Serie"
                    type="text"
                    style={{ width: 100, marginVertical: 4 }}
                  />
                  <FormikInputValue
                    name={`items.${index}.quantity`}
                    placeholder="Cantidad"
                    type="number"
                    style={{ width: 80, marginVertical: 4 }}
                  />
                  <FormikInputValue
                    name={`items.${index}.price`}
                    placeholder="Precio"
                    type="number"
                    style={{ width: 80, marginVertical: 4 }}
                  />

                  <Button
                    icon="delete"
                    justIcon
                    size="small"
                    label="Eliminar"
                    color="error"
                    variant="ghost"
                    onPress={() => arrayHelpers.remove(index)}
                  />
                </View>
              ))
            ) : (
              <Text style={gStyles.tCenter}>No hay artículos</Text>
            )}
            <Button
              label="Agregar artículo"
              icon="add"
              size="small"
              variant="ghost"
              onPress={() => arrayHelpers.push(defaultValues[0])}
            />
          </View>
        )}
      />

      <View>
        <Text style={gStyles.tCenter}>
          Articulos:{' '}
          {values?.items?.reduce(
            (acc, item) => acc + parseInt(`${item.quantity}`),
            0
          ) || 0}
        </Text>
        <Text style={gStyles.tCenter}>
          Total:{' '}
          <CurrencyAmount amount={orderAmount(values)} style={gStyles.h2} />
        </Text>
      </View>
    </View>
  )
}
export default FormikSaleOrderItems

export type FormikSaleOrderItemsProps = {
  name: string
}
export const FormikSaleOrderItemsE = (props: FormikSaleOrderItemsProps) => (
  <ErrorBoundary componentName="FormikSaleOrderItems">
    <FormikSaleOrderItems {...props} />
  </ErrorBoundary>
)
const styles = StyleSheet.create({})
