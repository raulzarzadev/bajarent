import { FieldArray, useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import { Dimensions, Text, View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import { orderAmount } from '../libs/order-amount'
import { gStyles } from '../styles'
import type { SaleOrderItem } from '../types/OrderType'
import Button from './Button'
import CurrencyAmount from './CurrencyAmount'
import ErrorBoundary from './ErrorBoundary'
import FormikInputSelect from './FormikInputSelect'
import FormikInputValue from './FormikInputValue'
import FormikInputMoney from './FormikInputMoney'
import { FormikInputCountE } from './FormikInputCount'

const FormikSaleOrderItems = ({ name }: { name: string }) => {
  const bigScreen = Dimensions.get('window').width > 600
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const { values } = useFormikContext<{
    items: SaleOrderItem[]
  }>()
  const { categories } = useStore()

  const [saleCategories, setSaleCategories] = useState<
    { label: string; value: string }[] | null
  >(null)
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
            <Text style={gStyles.h3}>Lista de artículos de venta</Text>
            {values.items && values.items.length > 0 ? (
              values.items.map((item, index) => (
                <View
                  key={item.id || index}
                  style={{
                    flexDirection: bigScreen ? 'row' : 'column',
                    marginVertical: 6,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderWidth: 1,
                    borderColor: '#eee',
                    borderRadius: 8,
                    padding: 8,
                    backgroundColor: editingIndex === index ? '#f8f8ff' : '#fff'
                  }}
                >
                  {editingIndex === index ? (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'column'
                      }}
                    >
                      <View
                        style={{
                          flexDirection: bigScreen ? 'row' : 'column',
                          gap: 8,
                          justifyContent: 'space-around'
                        }}
                      >
                        <FormikInputSelect
                          style={{ marginVertical: 4, flex: 1 }}
                          name={`items.${index}.category`}
                          placeholder="Categoria"
                          options={saleCategories || []}
                        />

                        <FormikInputValue
                          name={`items.${index}.name`}
                          placeholder="Marca"
                          type="text"
                          style={{ marginVertical: 4, flex: 1 }}
                        />

                        <FormikInputValue
                          name={`items.${index}.serial`}
                          placeholder="Serie"
                          type="text"
                          style={{ marginVertical: 4, flex: 1 }}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: bigScreen ? 'row' : 'column',
                          gap: 8,
                          justifyContent: 'space-around'
                        }}
                      >
                        <FormikInputValue
                          name={`items.${index}.quantity`}
                          placeholder="Cantidad"
                          type="number"
                          style={{ marginVertical: 4, flex: 1 }}
                        />

                        <FormikInputMoney
                          name={`items.${index}.price`}
                          placeholder="Precio"
                          style={{ marginVertical: 4, flex: 1 }}
                        />

                        <FormikInputCountE
                          name={`items.${index}.guaranteeMonths`}
                          label="Garantia (meses)"
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 8,
                          marginVertical: 8,
                          alignContent: 'center',
                          alignItems: 'center',
                          justifyContent: 'space-around'
                        }}
                      >
                        <Button
                          icon="delete"
                          size="small"
                          label="Eliminar"
                          color="error"
                          variant="ghost"
                          onPress={() => {
                            arrayHelpers.remove(index)
                            setEditingIndex(null)
                          }}
                        />
                        <Button
                          icon="cancel"
                          label="Cancelar"
                          size="small"
                          variant="ghost"
                          onPress={() => setEditingIndex(null)}
                        />
                        <Button
                          icon="save"
                          label="Guardar"
                          size="small"
                          color="primary"
                          variant="filled"
                          onPress={() => setEditingIndex(null)}
                        />
                      </View>
                    </View>
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: bigScreen ? 'row' : 'column',
                        alignItems: bigScreen ? 'center' : 'flex-start',
                        justifyContent: 'space-between'
                      }}
                    >
                      <View style={{ minWidth: 120 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 13 }}>
                          {item.name || 'Sin nombre'}
                        </Text>
                        {item.serial ? (
                          <Text
                            style={{ fontSize: 12, color: '#888' }}
                          >{`Serie: ${item.serial}`}</Text>
                        ) : null}
                        {item.categoryName ? (
                          <Text style={{ fontSize: 12, color: '#888' }}>
                            {item.categoryName}
                          </Text>
                        ) : null}
                      </View>

                      <Text style={{ minWidth: 70, fontSize: 13 }}>
                        Cant: {item.quantity}
                      </Text>

                      <Text style={{ minWidth: 90, fontSize: 13 }}>
                        Precio: <CurrencyAmount amount={item.price} />
                      </Text>
                      <Text>Garantia: {item?.guaranteeMonths || 0} meses</Text>
                      <Text style={{ minWidth: 90, fontSize: 13 }}>
                        Total:{' '}
                        <CurrencyAmount amount={item.price * item.quantity} />
                      </Text>

                      <Button
                        icon="edit"
                        size="small"
                        label="Editar"
                        color="primary"
                        variant="ghost"
                        onPress={() => setEditingIndex(index)}
                        disabled={editingIndex !== null}
                      />
                    </View>
                  )}
                </View>
              ))
            ) : (
              <Text style={gStyles.tCenter}>No hay artículos</Text>
            )}

            <Button
              label="Agregar artículo"
              icon="add"
              size="small"
              onPress={() => {
                arrayHelpers.push({
                  id: `${Date.now()}`,
                  name: '',
                  price: 0,
                  quantity: 1,
                  category: '',
                  serial: ''
                })
                setEditingIndex(values.items ? values.items.length : 0)
              }}
              disabled={editingIndex !== null}
              buttonStyles={{ marginHorizontal: 'auto' }}
            />
          </View>
        )}
      />

      <View>
        <Text style={gStyles.tCenter}>
          Artículos:{' '}
          {values?.items?.reduce(
            (acc, item) => acc + parseInt(`${item.quantity}`, 10),
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
