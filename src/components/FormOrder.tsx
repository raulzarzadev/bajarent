import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { ReactNode, SetStateAction, useEffect, useState } from 'react'
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
import FormikCheckbox from './FormikCheckbox'
import ModalAssignOrder from './OrderActions/ModalAssignOrder'
import ErrorBoundary from './ErrorBoundary'
import { gSpace, gStyles } from '../styles'
import { useStore } from '../contexts/storeContext'
import dictionary from '../dictionary'
import InputTextStyled from './InputTextStyled'
import FormikSelectItems from './FormikSelectItems'

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
  'selectItemRepair',
  'selectItemRent',
  'selectItems',
  'repairDescription', // Field name is 'description' in the form
  'itemBrand',
  'itemSerial',
  'imageID',
  'imageHouse',
  'hasDelivered',
  'assignIt',
  'sheetRow',
  'note'
  // 'folio'
] as const

export type FormOrderFields = (typeof LIST_OF_FORM_ORDER_FIELDS)[number]

const initialValues: Partial<OrderType> = {
  firstName: '',
  fullName: '',
  phone: '',
  // scheduledAt: new Date(),
  // type: order_type.RENT,
  address: ''
}
export type FormOrderProps = {
  renew?: string | number
  onSubmit?: (values: Partial<OrderType>) => Promise<any>
  defaultValues?: Partial<OrderType>
}
const FormOrderA = ({
  renew = '', // number of order to renew
  onSubmit = async (values) => {
    console.log(values)
  },
  defaultValues = initialValues
}: FormOrderProps) => {
  const [loading, setLoading] = React.useState(false)
  const { store } = useStore()

  const ordersTypesAllowed = Object.entries(store?.orderTypes || {})
    .filter(([key, value]) => value)
    .map((value) => {
      return { label: dictionary(value[0] as order_type), value: value[0] }
    })
    .sort((a, b) => {
      // hard sort to put delivery rent first
      if (a.value === order_type.DELIVERY_RENT) return -1
      return a.label.localeCompare(b.label)
    })

  const [defaultType, setDefaultType] = useState<order_type>(
    defaultValues?.type || (ordersTypesAllowed[0]?.value as order_type)
  )
  // ordersTypesAllowed[0]?.value as order_type

  useEffect(() => {
    if (defaultValues.type) {
      setDefaultType(defaultValues.type)
    } else {
      setDefaultType(ordersTypesAllowed[0]?.value as order_type)
    }
  }, [ordersTypesAllowed, defaultValues])
  // => const defaultType =  ordersTypesAllowed[0]?.value as order_type
  const initialValues = {
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
      `${defaultValues?.street || ''}${defaultValues?.betweenStreets || ''}`
  }

  if (ordersTypesAllowed.length === 0)
    return (
      <>
        <Text style={{ textAlign: 'center', marginVertical: gSpace(4) }}>
          Para crear ordenes, debes configurarlas primero en la tienda
        </Text>
      </>
    )

  return (
    <ScrollView>
      <View style={gStyles.container}>
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
          initialValues={initialValues}
          onSubmit={async (values, { resetForm }) => {
            setLoading(true)
            await onSubmit(values)
              .then((res) => {
                resetForm()
              })
              .catch(console.error)
              .finally(() => {
                setLoading(false)
              })
          }}
        >
          {({ handleSubmit, setValues, values }) => {
            return (
              <>
                <InputRadiosFormik
                  name="type"
                  options={ordersTypesAllowed}
                  label="Tipo de orden"
                />

                {values.type === order_type.REPAIR && (
                  <FormFields
                    fields={[
                      'fullName',
                      'phone',
                      'location',
                      'neighborhood',
                      'address',
                      'references',
                      'selectItemRepair',
                      'repairDescription',
                      'itemBrand',
                      'itemSerial',
                      'assignIt'
                    ]}
                    values={values}
                    setValues={setValues}
                  />
                )}
                {values.type === order_type.DELIVERY_RENT && (
                  <FormFields
                    fields={[
                      'sheetRow',
                      'note',
                      'fullName',
                      'phone',
                      'location',
                      'neighborhood',
                      'address',
                      'references',
                      'selectItemRent',
                      'assignIt',
                      'hasDelivered'
                    ]}
                    values={values}
                    setValues={setValues}
                  />
                )}
                {values.type === order_type.RENT && (
                  <FormFields
                    fields={['fullName', 'phone', 'selectItemRent', 'imageID']}
                    values={values}
                    setValues={setValues}
                  />
                )}
                {values.type === order_type.STORE_RENT && (
                  <FormFields
                    fields={[
                      'fullName',
                      'phone',
                      'selectItemRent',
                      'imageID',
                      'assignIt',
                      'hasDelivered'
                    ]}
                    values={values}
                    setValues={setValues}
                  />
                )}
                {values?.type === order_type.SALE && (
                  <FormFields
                    fields={['fullName', 'phone', 'selectItems']}
                    values={values}
                    setValues={setValues}
                  />
                )}
                {values?.type === order_type.DELIVERY_SALE && (
                  <FormFields
                    fields={[
                      'fullName',
                      'phone',
                      'selectItems',
                      'address',
                      'neighborhood',
                      'references'
                    ]}
                    values={values}
                    setValues={setValues}
                  />
                )}
                {values?.type === order_type.MULTI_RENT && (
                  <FormFields
                    fields={['fullName', 'phone', 'selectItems', 'imageID']}
                    values={values}
                    setValues={setValues}
                  />
                )}
                <View style={[styles.item]}>
                  <Button
                    disabled={loading || !values?.fullName}
                    onPress={async () => {
                      handleSubmit()
                    }}
                    label={'Guardar'}
                  />
                </View>
              </>
            )
          }}
        </Formik>
      </View>
    </ScrollView>
  )
}

type FormFieldsProps = {
  fields: FormOrderFields[]
  values: Partial<OrderType>
  setValues: (
    values: SetStateAction<Partial<OrderType>>,
    shouldValidate?: boolean | undefined
  ) => void
}
const FormFields = (props: FormFieldsProps) => (
  <ErrorBoundary componentName="FormFieldsA">
    <FormFieldsA {...props}></FormFieldsA>
  </ErrorBoundary>
)

const FormFieldsA = ({ fields, values, setValues }: FormFieldsProps) => {
  const { categories, store } = useStore()

  const ordersTypesAllowed = Object.entries(store?.orderTypes || {})
    .filter(([key, value]) => value)
    .map((value) => {
      return { label: dictionary(value[0] as order_type), value: value[0] }
    })

  const [sheetRow, setSheetRow] = useState<string | undefined>('')

  useEffect(() => {
    if (!sheetRow) return
    const [note, name, phone, neighborhood, address, references, number, date] =
      sheetRow?.split('\t') || []

    const scheduledAt = date && new Date(asDate(date)?.setHours(9))

    setValues({
      ...values,
      note,
      fullName: name,
      phone: `+52${phone}`,
      neighborhood,
      address: `${address} ${number}`,
      references,
      scheduledAt,
      item: {
        categoryName: 'Lavadora',
        priceSelected: null,
        priceSelectedId: null
      }
    })
  }, [sheetRow])

  const inputFields: Record<FormOrderFields, ReactNode> = {
    type: (
      <InputRadiosFormik
        name="type"
        options={ordersTypesAllowed}
        label="Tipo de orden"
      />
    ),
    sheetRow: (
      <InputTextStyled
        onChangeText={(text) => setSheetRow(text)}
        placeholder="Fila de excel"
        helperText={
          'Una fila de una hoja de excel (No.nota, nombre, telefono, colonia, dirección, referencias, No.Casa, fecha) '
        }
      />
    ),
    note: (
      <InputValueFormik
        name={'note'}
        placeholder="Nota"
        helperText={'Numero de nota o referencia externa'}
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
    address: (
      <InputValueFormik
        name={'address'}
        placeholder="Dirección completa (calle, numero y entre calles)"
        helperText={`Ejemplo: Calle 1 #123 entre Calle 2 y Calle 3`}
      />
    ),
    imageID: <FormikInputImage name="imageID" label="Subir identificación" />,
    imageHouse: <FormikInputImage name="imageHouse" label="Subir fachada " />,
    neighborhood: (
      <InputValueFormik
        name={'neighborhood'}
        placeholder="Colonia"
        helperText="Ejemplo: Centro, San Pedro, etc."
      />
    ),
    location: <InputLocationFormik name={'location'} />,
    references: (
      <InputValueFormik
        name={'references'}
        placeholder="Referencias de la casa"
        helperText="Ejemplo: Casa blanca con portón rojo"
      />
    ),
    scheduledAt: (
      <InputDate
        label="Fecha programada"
        value={asDate(values.scheduledAt) || new Date()}
        setValue={(value) =>
          setValues({ ...values, scheduledAt: value }, false)
        }
      />
    ),
    selectItemRepair: (
      <FormikSelectCategoryItem
        name="item"
        label="Selecciona un artículo"
        categories={categories.map((cat) => ({
          ...cat
        }))}
      />
    ),
    selectItemRent: (
      <FormikSelectCategoryItem
        name="item"
        label="Selecciona un artículo"
        categories={categories.map((cat) => ({
          ...cat
        }))}
        selectPrice
        startAt={values.scheduledAt}
      />
    ),
    selectItems: (
      <FormikSelectItems
        name="item"
        label="Selecciona un artículo"
        categories={categories.map((cat) => ({
          ...cat
        }))}
        selectPrice
        startAt={values.scheduledAt}
        setItems={(items) => setValues({ ...values, items })}
        items={values.items}
      />
    ),
    hasDelivered: (
      <FormikCheckbox
        name="hasDelivered"
        label="Entregada en la fecha programada"
      />
    ),
    repairDescription: (
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
    assignIt: (
      <ErrorBoundary componentName="ModalAssignOrder">
        <ModalAssignOrder
          orderId={values.id}
          section={values.assignToSection}
          date={values.scheduledAt}
          assignSection={(sectionId) => {
            setValues({ ...values, assignToSection: sectionId })
          }}
          assignDate={(date) => setValues({ ...values, scheduledAt: date })}
        />
      </ErrorBoundary>
    )
  }

  return (
    <View>
      {fields.map((field) => (
        <View key={field} style={[styles.item]}>
          {inputFields[field]}
        </View>
      ))}
    </View>
  )
}

export default function FormOrder(props: FormOrderProps) {
  return (
    <ErrorBoundary componentName="FormOrder">
      <FormOrderA {...props}></FormOrderA>
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  form: {
    maxWidth: 500,
    width: '100%',
    marginHorizontal: 'auto',
    padding: 10
    // padding: theme.padding.md
  },
  item: {
    marginVertical: 8
  }
})
