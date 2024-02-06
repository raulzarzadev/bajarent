import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import InputValueFormik from './InputValueFormik'
import OrderType, { order_type } from '../types/OrderType'
import Button from './Button'

import FormikInputPhone from './InputPhoneFormik'
import InputDate from './InputDate'
import asDate from '../libs/utils-date'
import InputLocationFormik from './InputLocationFormik'
import InputRadiosFormik from './InputRadiosFormik'
import FormikInputImage from './FormikInputImage'
import P from './P'
import FormikSelectCategoryItem from './FormikSelectCategoryItem'
import CATEGORIES_ITEMS from '../DATA/CATEGORIES_ITEMS'
import CurrencyAmount from './CurrencyAmount'
import theme from '../theme'
import FormikCheckbox from './FormikCheckbox'
import ModalAssignOrder from './OrderActions/ModalAssignOrder'
import ErrorBoundary from './ErrorBoundary'

const initialValues: Partial<OrderType> = {
  firstName: '',
  phone: '',
  scheduledAt: new Date(),
  type: order_type.RENT
}

const FormOrder = ({
  onSubmit = async (values) => {
    console.log(values)
  },
  defaultValues = initialValues
}) => {
  const [loading, setLoading] = React.useState(false)

  const disabledSave = loading
  return (
    <ScrollView>
      <Text style={{ textAlign: 'center', marginTop: 12 }}>
        <P bold size="xl">
          Folio:{' '}
        </P>
        <P size="xl">{defaultValues?.folio}</P>
      </Text>
      <Formik
        initialValues={defaultValues}
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
              style={[styles.item, { justifyContent: 'center', width: '100%' }]}
            >
              <FormikCheckbox
                name="hasDelivered"
                label="Entregada en la fecha programada"
              />
            </View>

            <View style={[styles.item]}>
              <InputValueFormik
                name={'firstName'}
                placeholder="Nombre (s)"
                helperText={!values.firstName && 'Nombre es requerido'}
                helperTextColor={theme.error}
              />
            </View>
            <View style={[styles.item]}>
              <InputValueFormik name={'lastName'} placeholder="Apellido (s)" />
            </View>
            <View style={[styles.item]}>
              <FormikInputPhone name={'phone'} />
            </View>
            <View style={[styles.item]}>
              <InputLocationFormik name={'location'} />
            </View>
            <View style={[styles.item]}>
              <InputValueFormik name={'neighborhood'} placeholder="Colonia" />
            </View>
            <View style={[styles.item]}>
              <InputValueFormik name={'street'} placeholder="Calle y numero" />
            </View>
            <View style={[styles.item]}>
              <InputValueFormik
                name={'betweenStreets'}
                placeholder="Entre calles"
              />
            </View>

            <View style={[styles.item]}>
              <InputValueFormik
                name={'references'}
                placeholder="Referencias de la casa"
              />
            </View>

            <View style={[styles.item, { justifyContent: 'center' }]}>
              <InputRadiosFormik
                name="type"
                options={[
                  { label: 'Renta', value: order_type.RENT },
                  { label: 'Reparación', value: order_type.REPAIR }
                ]}
                label="Tipo de orden"
              />
            </View>

            <View style={[styles.item]}>
              {values.type === order_type.REPAIR && (
                <View>
                  <FormikSelectCategoryItem
                    name="item"
                    label="Selecciona un artículo"
                    categories={CATEGORIES_ITEMS.categories}
                  />
                  <Text style={{ marginVertical: 4 }}>
                    Costo por visita{' '}
                    <Text style={{ fontWeight: 'bold' }}>
                      <CurrencyAmount amount={300} />
                    </Text>
                    . Reembolsable si se realiza la reparación
                  </Text>

                  <InputValueFormik
                    name={'description'}
                    placeholder="Describe la falla"
                    helperText="Ejemplo: Lavadora no lava, hace ruido."
                  />
                  <InputValueFormik
                    name={'itemBrand'}
                    placeholder="Marca"
                    helperText="Ejemplo: Mytag"
                  />
                  <InputValueFormik
                    name={'itemSerial'}
                    placeholder="Numero de serie"
                  />
                </View>
              )}
              {values.type === order_type.RENT && (
                <>
                  <FormikSelectCategoryItem
                    name="item"
                    label="Selecciona un artículo"
                    categories={CATEGORIES_ITEMS.categories}
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
            <View style={[styles.item, { justifyContent: 'center' }]}>
              <ErrorBoundary>
                <ModalAssignOrder
                  assignToSection={(sectionId) => {
                    setValues((values) => ({
                      ...values,
                      assignToSection: sectionId
                    }))
                  }}
                  assignToStaff={(staffId) => {
                    setValues((values) => ({
                      ...values,
                      assignToStaff: staffId
                    }))
                  }}
                  assignedToSection={values?.assignToSection}
                  assignedToStaff={values?.assignToStaff}
                />
              </ErrorBoundary>
            </View>
            <View style={[styles.item]}>
              <Button
                disabled={disabledSave || !values?.firstName}
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
