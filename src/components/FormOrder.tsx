import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { ReactNode, SetStateAction, useEffect, useState } from 'react'
import { Formik } from 'formik'
import InputValueFormik from './InputValueFormik'
import OrderType, {
  TypeOrder,
  TypeOrderKey,
  order_type
} from '../types/OrderType'
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
import { extraFields } from './FormStore'
import InputRadios from './InputRadios'

//#region FUNCTIONS

const getOrderFields = (fields, type): FormOrderFields[] => {
  const mandatoryFieldsStart: FormOrderFields[] = ['fullName', 'phone']

  let mandatoryFieldsEnd: FormOrderFields[] = []
  if (type === TypeOrder.RENT) mandatoryFieldsEnd = ['selectItemsRent']
  if (type === TypeOrder.REPAIR) mandatoryFieldsEnd = ['selectItemsRepair']
  if (type === TypeOrder.SALE) mandatoryFieldsEnd = ['selectItemsSale']

  let res: FormOrderFields[] = []
  const extraFieldsAllowed = extraFields.filter((field) => fields?.[field])
  res = extraFieldsAllowed
  return [...mandatoryFieldsStart, ...res, ...mandatoryFieldsEnd]
}
const LIST_OF_FORM_ORDER_FIELDS = [
  'type',
  'fullName',
  'phone',
  'scheduledAt',
  'address',
  'location',
  'neighborhood',
  'references',
  'repairDescription', // Field name is 'description' in the form
  'itemBrand',
  'itemSerial',
  'imageID',
  'imageHouse',
  'hasDelivered',
  'assignIt',
  'sheetRow',
  'note',
  'selectItemsRepair',
  'selectItemsRent',
  'selectItemsSale'
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

//#region TYPES
export type FormOrderProps = {
  renew?: string | number
  onSubmit?: (values: Partial<OrderType>) => Promise<any>
  defaultValues?: Partial<OrderType>
  title?: string
}

//#region COMPONENT
const FormOrderA = ({
  renew = '', // number of order to renew
  onSubmit = async (values) => {
    console.log(values)
  },
  defaultValues = initialValues,
  title
}: FormOrderProps) => {
  const [loading, setLoading] = React.useState(false)
  const { store } = useStore()

  //* <- Define order types allowed
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

  //* <- Set default type
  useEffect(() => {
    if (defaultValues.type) {
      setDefaultType(defaultValues.type)
    } else {
      setDefaultType(ordersTypesAllowed[0]?.value as order_type)
    }
  }, [ordersTypesAllowed, defaultValues])

  //* <- Define initial values
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

  /* ********************************************
   * define order fields depends of order type
   *******************************************rz */
  const [orderFields, setOrderFields] = useState<FormOrderFields[]>([])
  const [orderType, setOrderType] = useState<TypeOrderKey>(
    initialValues.type as TypeOrderKey
  )
  useEffect(() => {
    const res = getOrderFields(store?.orderFields?.[orderType], orderType)
    setOrderFields(res)
  }, [orderType])

  //#region render
  return (
    <ScrollView>
      <View style={gStyles.container}>
        {/*
         // *** *** shows some metadata
         */}
        {defaultValues?.folio && (
          <Text style={{ textAlign: 'center', marginTop: 12 }}>
            <P bold size="xl">
              Folio:{' '}
            </P>
            <P size="xl">{defaultValues?.folio}</P>
          </Text>
        )}
        {title && <Text style={gStyles.h3}>{title}</Text>}
        {!!renew && <Text style={gStyles.h3}>Renovación de orden {renew}</Text>}

        {/*
         // *** *** Select order type
         */}
        <InputRadios
          options={ordersTypesAllowed}
          setValue={(value: TypeOrderKey) => {
            setOrderType(value)
          }}
          value={orderType}
          layout="row"
        />
        {/*
         // *** *** render form depending on order type
         */}
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
                <FormFields
                  fields={orderFields}
                  values={values}
                  setValues={setValues}
                />

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

//#region FormFields ErrorBoundary

const FormFields = (props: FormFieldsProps) => (
  <ErrorBoundary componentName="FormFieldsA">
    <FormFieldsA {...props}></FormFieldsA>
  </ErrorBoundary>
)

//#region FormFields

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

  //#region InputFields
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

    selectItemsRepair: (
      <FormikSelectItems
        name="item"
        label="Selecciona un artículo"
        categories={categories.map((cat) => ({
          ...cat
        }))}
        //selectPrice
        startAt={values.scheduledAt}
        setItems={(items) => setValues({ ...values, items })}
        items={values.items}
      />
    ),
    selectItemsRent: (
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
    selectItemsSale: (
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

//#region ERROR BOUNDARY

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
