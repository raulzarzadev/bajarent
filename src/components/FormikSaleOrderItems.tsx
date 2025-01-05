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
  return (
    <View>
      <FieldArray
        name={name}
        render={(arrayHelpers) => (
          <View>
            {values.items && values.items.length > 0 ? (
              values.items.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: layoutRow ? 'row' : 'column',
                    marginVertical: 6,
                    alignItems: 'center'
                  }}
                >
                  <FormikInputSelect
                    name={`items.${index}.category`}
                    placeholder="Categoria"
                    options={categories
                      .map((cat) => {
                        return { label: cat.name, value: cat.id }
                      })
                      .sort((a, b) => a.label.localeCompare(b.label))}
                  />
                  <FormikInputValue
                    name={`items.${index}.serial`}
                    placeholder="Serie"
                    type="text"
                    style={{ marginVertical: 4 }}
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
              <Text>No hay items</Text>
            )}
            <Button
              label="Agregar item"
              icon="add"
              size="small"
              variant="ghost"
              onPress={() => arrayHelpers.push(defaultValues[0])}
            />
          </View>
        )}
      />

      <View>
        <Text>
          Articulos:{' '}
          {values?.items?.reduce(
            (acc, item) => acc + parseInt(`${item.quantity}`),
            0
          ) || 0}
        </Text>
        <Text>Total:</Text>
        <CurrencyAmount amount={orderAmount(values)} />
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
