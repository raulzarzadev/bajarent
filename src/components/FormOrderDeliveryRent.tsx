import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import OrderType, { order_type } from '../types/OrderType'
import Button from './Button'
import FormikInputPhone from './FormikInputPhone'
import InputDate from './InputDate'
import asDate from '../libs/utils-date'
import InputLocationFormik from './InputLocationFormik'
import InputRadiosFormik from './InputRadiosFormik'
import FormikInputImage from './FormikInputImage'
import P from './P'
import FormikSelectCategoryItem from './FormikSelectCategoryItem'
import CurrencyAmount from './CurrencyAmount'
import FormikCheckbox from './FormikCheckbox'
import ModalAssignOrder from './OrderActions/ModalAssignOrder'
import ErrorBoundary from './ErrorBoundary'
import { gStyles } from '../styles'
import { useStore } from '../contexts/storeContext'
import dictionary from '../dictionary'
import FormikInputValue from './FormikInputValue'

const initialValues: Partial<OrderType> = {
  firstName: '',
  fullName: '',
  phone: '',
  scheduledAt: new Date(),
  // type: order_type.RENT,
  address: ''
}

const FormOrder = ({
  renew = '', // number of order to renew
  onSubmit = async (values) => {
    console.log(values)
  },
  defaultValues = initialValues
}: {
  renew?: string | number
  onSubmit?: (values: Partial<OrderType>) => Promise<any>
  defaultValues?: Partial<OrderType>
}) => {
  const [loading, setLoading] = React.useState(false)
  const { categories, store } = useStore()

  const ordersTypesAllowed = Object.entries(store?.orderTypes || {})
    .filter(([key, value]) => value)
    .map((value) => {
      return { label: dictionary(value[0] as order_type), value: value[0] }
    })

  const defaultType = ordersTypesAllowed[0]?.value as order_type

  return (
    <ScrollView>
      {defaultValues?.folio && (
        <Text style={{ textAlign: 'center', marginTop: 12 }}>
          <P bold size="xl">
            Folio:{' '}
          </P>
          <P size="xl">{defaultValues?.folio}</P>
        </Text>
      )}
      {!!renew && <Text style={gStyles.h3}>Renovación de orden {renew}</Text>}
      <Formik
        initialValues={{
          ...defaultValues,
          type: defaultType,

          phone:
            defaultValues?.phone === 'undefined' || !defaultValues.phone
              ? ''
              : defaultValues?.phone,
          fullName:
            defaultValues?.fullName ||
            `${defaultValues?.firstName || ''}${defaultValues?.lastName || ''}`,
          address:
            defaultValues?.address ||
            `${defaultValues?.street || ''}${
              defaultValues?.betweenStreets || ''
            }`
        }}
        onSubmit={async (values) => {
          setLoading(true)
          await onSubmit(values)
            .then((res) => {
              // console.log(res)
            })
            .catch(console.error)
            .finally(() => {
              setLoading(false)
            })
        }}
      >
        {({ handleSubmit, setValues, values }) => (
          <View style={styles.form}>
            <View style={[styles.item, { justifyContent: 'center' }]}>
              <InputRadiosFormik
                name="type"
                options={ordersTypesAllowed}
                label="Tipo de orden"
              />
            </View>
            <View style={[styles.item]}>
              <FormikInputValue
                name={'fullName'}
                placeholder="Nombre completo"
                helperText={!values.fullName && 'Nombre es requerido'}
              />
            </View>
            <View style={[styles.item]}>
              <FormikInputPhone name={'phone'} />
            </View>
            {values.type !== order_type.STORE_RENT && (
              <>
                <View style={[styles.item]}>
                  <InputLocationFormik name={'location'} />
                </View>
                <View style={[styles.item]}>
                  <FormikInputValue
                    name={'neighborhood'}
                    placeholder="Colonia"
                  />
                </View>
                <View style={[styles.item]}>
                  <FormikInputValue
                    name={'address'}
                    placeholder="Dirección completa ( calle, numero, entre calles)"
                  />
                </View>
                <View style={[styles.item]}>
                  <FormikInputValue
                    name={'references'}
                    placeholder="Referencias de la casa"
                  />
                </View>
              </>
            )}

            <View style={[styles.item]}>
              {values.type === order_type.REPAIR && (
                <View>
                  <FormikSelectCategoryItem
                    name="item"
                    label="Selecciona un artículo"
                    categories={categories}
                  />
                  <Text style={{ marginVertical: 4 }}>
                    Costo por visita{' '}
                    <Text style={{ fontWeight: 'bold' }}>
                      <CurrencyAmount amount={300} />
                    </Text>
                    . Reembolsable si se realiza la reparación
                  </Text>

                  <FormikInputValue
                    name={'description'}
                    placeholder="Describe la falla"
                    helperText="Ejemplo: Lavadora no lava, hace ruido."
                  />
                  <FormikInputValue
                    name={'itemBrand'}
                    placeholder="Marca"
                    helperText="Ejemplo: Mytag"
                  />
                  <FormikInputValue
                    name={'itemSerial'}
                    placeholder="Numero de serie"
                  />
                </View>
              )}
              {values.type === order_type.STORE_RENT && (
                <>
                  <FormikSelectCategoryItem
                    name="item"
                    label="Selecciona un artículo"
                    categories={categories.map((cat) => ({
                      ...cat
                    }))}
                    selectPrice
                  />

                  <View style={[styles.item]}>
                    <FormikInputImage
                      name="imageID"
                      label="Subir identificación"
                    />
                  </View>
                </>
              )}
              {values.type === order_type.RENT && (
                <>
                  <FormikSelectCategoryItem
                    name="item"
                    label="Selecciona un artículo"
                    categories={categories.map((cat) => ({
                      ...cat
                    }))}
                    selectPrice
                  />

                  <View style={[styles.item]}>
                    <FormikInputImage
                      name="imageID"
                      label="Subir identificación"
                    />
                  </View>
                  <View style={[styles.item]}>
                    <FormikInputImage
                      name="imageHouse"
                      label="Subir fachada "
                    />
                  </View>
                </>
              )}
            </View>
            {values.type !== order_type.STORE_RENT && (
              <>
                <View style={[styles.item, { justifyContent: 'center' }]}>
                  <ErrorBoundary>
                    <ModalAssignOrder orderId={values.id} />
                  </ErrorBoundary>
                </View>
                <View style={[styles.item]}>
                  <InputDate
                    label="Fecha programada"
                    value={asDate(values.scheduledAt) || new Date()}
                    setValue={(value) =>
                      setValues(
                        (values) => ({ ...values, scheduledAt: value }),
                        false
                      )
                    }
                  />
                </View>

                <View
                  style={[
                    styles.item,
                    { justifyContent: 'center', width: '100%' }
                  ]}
                >
                  <FormikCheckbox
                    name="hasDelivered"
                    label="Entregada en la fecha programada"
                  />
                </View>
              </>
            )}

            <View style={[styles.item]}>
              <Button
                disabled={loading || !values?.fullName}
                onPress={handleSubmit}
                label={'Guardar'}
              />
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  )
}

export default FormOrder

const styles = StyleSheet.create({
  form: {
    maxWidth: 500,
    width: '100%',
    marginHorizontal: 'auto',
    padding: 10
    // padding: theme.padding.md
  },
  item: {
    marginVertical: 10
  }
})
