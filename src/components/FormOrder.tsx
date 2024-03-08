import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { ReactNode } from 'react'
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
import CurrencyAmount from './CurrencyAmount'
import FormikCheckbox from './FormikCheckbox'
import ModalAssignOrder from './OrderActions/ModalAssignOrder'
import ErrorBoundary from './ErrorBoundary'
import { gStyles } from '../styles'
import { useStore } from '../contexts/storeContext'
import dictionary from '../dictionary'

const LIST_OF_FORM_ORDER_FIELDS = [
  'type',
  'fullName',
  'phone',
  'scheduledAt',
  'address',
  'type',
  'location',
  'neighborhood',
  'references',
  'item',
  'description',
  'itemBrand',
  'itemSerial',
  'imageID',
  'imageHouse',
  'scheduledAt',
  'assignedToSection',
  'assignedToStaff',
  'hasDelivered'
  // 'folio'
] as const

export type FormOrderFields = (typeof LIST_OF_FORM_ORDER_FIELDS)[number]

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
  const { store } = useStore()

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
          <>
            <InputRadiosFormik
              name="type"
              options={ordersTypesAllowed}
              label="Tipo de orden"
            />
            {/* {values.type === order_type.RENT && (
                <FormFields
                  fields={['fullName', 'phone', 'imageID']}
                  values={values}
                  setValues={setValues}
                />
              )}
            {values.type === order_type.STORE_RENT && (
              <FormFields
                fields={['fullName', 'phone', 'imageID']}
                values={values}
                setValues={setValues}
              />
            )}
            {values.type === order_type.SALE && (
              <FormFields
                fields={['fullName', 'phone', 'imageID']}
                values={values}
                setValues={setValues}
              />
            )} */}
            {values.type === order_type.REPAIR && (
              <FormFields
                fields={[
                  'fullName',
                  'phone',
                  'location',
                  'neighborhood',
                  'address',
                  'references',
                  'item',
                  'assignedToSection',
                  'scheduledAt',
                  'hasDelivered'
                ]}
                values={values}
                setValues={setValues}
              />
            )}
            <View style={[styles.item]}>
              <Button
                disabled={loading || !values?.fullName}
                onPress={handleSubmit}
                label={'Guardar'}
              />
            </View>
          </>
        )}
      </Formik>
    </ScrollView>
  )
}

const FormFields = ({
  fields,
  values,
  setValues
}: {
  fields: FormOrderFields[]
  values: Partial<OrderType>
  setValues: (values: Partial<OrderType>, shouldValidate?: boolean) => void
}) => {
  const { categories, store } = useStore()

  const ordersTypesAllowed = Object.entries(store?.orderTypes || {})
    .filter(([key, value]) => value)
    .map((value) => {
      return { label: dictionary(value[0] as order_type), value: value[0] }
    })

  const inputFields: Record<FormOrderFields, ReactNode> = {
    type: (
      <InputRadiosFormik
        name="type"
        options={ordersTypesAllowed}
        label="Tipo de orden"
      />
    ),
    fullName: (
      <InputValueFormik
        name={'fullName'}
        placeholder="Nombre completo"
        helperText={!values.fullName && 'Nombre es requerido'}
      />
    ),
    phone: <FormikInputPhone name={'phone'} />,
    imageID: <FormikInputImage name="imageID" label="Subir identificación" />,
    imageHouse: <FormikInputImage name="imageHouse" label="Subir fachada " />,
    neighborhood: (
      <InputValueFormik name={'neighborhood'} placeholder="Colonia" />
    ),
    location: <InputLocationFormik name={'location'} />,
    references: (
      <InputValueFormik
        name={'references'}
        placeholder="Referencias de la casa"
      />
    ),
    address: (
      <InputValueFormik
        name={'address'}
        placeholder="Dirección completa (calle, numero y entre calles)"
      />
    ),
    scheduledAt: (
      <InputDate
        label="Fecha programada"
        value={asDate(values.scheduledAt) || new Date()}
        setValue={(value) =>
          setValues((values) => ({ ...values, scheduledAt: value }), false)
        }
      />
    ),
    item: (
      <FormikSelectCategoryItem
        name="item"
        label="Selecciona un artículo"
        categories={categories.map((cat) => ({
          ...cat
        }))}
        selectPrice
      />
    ),
    hasDelivered: (
      <FormikCheckbox
        name="hasDelivered"
        label="Entregada en la fecha programada"
      />
    ),
    description: (
      <InputValueFormik
        name={'description'}
        placeholder="Describe la falla"
        helperText="Ejemplo: Lavadora no lava, hace ruido."
      />
    ),
    itemBrand: (
      <InputValueFormik
        name={'itemBrand'}
        placeholder="Marca"
        helperText="Ejemplo: Mytag"
      />
    ),
    itemSerial: (
      <InputValueFormik name={'itemSerial'} placeholder="No. de serie" />
    ),
    assignedToSection: (
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
    ),
    assignedToStaff: (
      <InputValueFormik
        name={'itemBrand'}
        placeholder="Marca"
        helperText="Ejemplo: Mytag"
      />
    )
  }

  return (
    <View style={gStyles.container}>
      {fields.map((field) => (
        <View style={[styles.item]}>{inputFields[field]}</View>
      ))}
    </View>
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
