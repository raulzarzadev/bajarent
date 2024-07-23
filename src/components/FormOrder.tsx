import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { ReactNode, SetStateAction, useEffect, useState } from 'react'
import { Formik } from 'formik'
import InputValueFormik from './FormikInputValue'
import OrderType, { TypeOrder, order_type } from '../types/OrderType'
import Button from './Button'
import FormikInputPhone from './FormikInputPhone'
import InputDate from './InputDate'
import asDate from '../libs/utils-date'
import InputLocationFormik from './InputLocationFormik'
import InputRadiosFormik from './FormikInputRadios'
import FormikInputImage from './FormikInputImage'
import P from './P'
import FormikCheckbox from './FormikCheckbox'
import ErrorBoundary from './ErrorBoundary'
import { gSpace, gStyles } from '../styles'
import { useStore } from '../contexts/storeContext'
import dictionary from '../dictionary'
import InputTextStyled from './InputTextStyled'
import { extraFields } from './FormStore'
import theme from '../theme'
import FormikAssignOrder from './FormikAssignOrder'
import FormikSelectCategories from './FormikSelectCategories'
import Loading from './Loading'
import TextInfo from './TextInfo'

//#region FUNCTIONS
type OrderFields = Partial<Record<FormOrderFields, boolean>>
const getOrderFields = (
  fields: OrderFields,
  type: TypeOrder
): FormOrderFields[] => {
  //* extra ops config
  //* add extra ops config at the really first of the form
  const extraOps = [
    'hasDelivered', //*<- if order has delivered is marked as DELIVERED and its like new item already exists
    'sheetRow', //*<- you can paste a google sheet row to get the data much more easy
    'note', //*<- kind of external reference
    'scheduledAt'
  ]?.filter((field) => !!fields?.[field]) as FormOrderFields[]

  const mandatoryFieldsStart: FormOrderFields[] = ['fullName', 'phone']

  let mandatoryFieldsEnd: FormOrderFields[] = []
  if (type === TypeOrder.RENT) mandatoryFieldsEnd = ['selectItemsRent']
  if (type === TypeOrder.REPAIR) mandatoryFieldsEnd = ['selectItemsRepair']
  if (type === TypeOrder.SALE) mandatoryFieldsEnd = ['selectItemsSale']

  let addedFields: FormOrderFields[] = []
  const extraFieldsAllowed = extraFields
    ?.filter((field) => fields?.[field])
    //* clear extra ops because are already included at the first of the form
    ?.filter((field) => !extraOps.includes(field))

  addedFields = extraFieldsAllowed
  const res = [
    ...extraOps,
    ...mandatoryFieldsStart,
    ...addedFields,
    ...mandatoryFieldsEnd
  ]
  return res
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
  'assignIt',

  'hasDelivered',
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
  const isRenew = !!renew
  const [loading, setLoading] = React.useState(false)
  const { store } = useStore()
  const [error, setError] = useState<string | null>(null)

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

  if (!store) return <Loading />
  if (!defaultType)
    return (
      <TextInfo
        defaultVisible
        text="Primero debes configurar el tipo de ordenes en tu tienda"
      />
    )
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

        <Formik
          initialValues={initialValues}
          onSubmit={async (values, { resetForm }) => {
            setLoading(true)
            setError(null)

            console.log(values.sheetRow)
            delete values.sheetRow //*<--- remove sheetRow from values

            await onSubmit(values)
              .then((res) => {
                resetForm()
              })
              .catch((e) => {
                setError(
                  'Error al guardar la orden, intente de nuevo más tarde'
                )
                console.error
              })
              .finally(() => {
                setLoading(false)
              })
          }}
          validate={(values) => {
            const errors: Partial<OrderType> = {}
            if (!values.fullName) errors.fullName = '*Nombre necesario'
            if (!values.phone || values.phone.length < 12)
              errors.phone = '*Teléfono valido es necesario'

            /* ********************************************
             * If orders has delivered, then must have a scheduled date
             *******************************************rz */

            if (values.hasDelivered && !values.scheduledAt)
              //@ts-ignore
              errors.scheduledAt = '*Fecha  necesaria'

            return errors
          }}
        >
          {({ handleSubmit, setValues, values, errors, setErrors }) => {
            useEffect(() => {
              setErrors({})
              //setOrderFields(store?.orderFields?.[values.type] as OrderFields)
            }, [values])
            return (
              <>
                <InputRadiosFormik
                  name="type"
                  options={ordersTypesAllowed}
                  label="Tipo de orden"
                  disabled={isRenew}
                />

                <FormFields
                  fields={getOrderFields(
                    store?.orderFields?.[values.type] as OrderFields,
                    //@ts-ignore FIXME: as TypeOrder or TypeOrderKey
                    values.type
                  )}
                  values={values}
                  setValues={setValues}
                  setLoading={setLoading}
                />

                <View>
                  {Object.entries(errors).map(([key, value]) => (
                    <Text key={key} style={[gStyles.p, { color: theme.error }]}>
                      {value as string}
                    </Text>
                  ))}
                </View>
                {!!error && (
                  <Text style={[gStyles.p, { color: theme.error }]}>
                    {error}
                  </Text>
                )}

                <View style={[styles.item]}>
                  <Button
                    disabled={loading || Object.keys(errors).length > 0}
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
  setLoading?: (loading: boolean) => void
}

//#region FormFields ErrorBoundary

const FormFields = (props: FormFieldsProps) => (
  <ErrorBoundary componentName="FormFieldsA">
    <FormFieldsA {...props}></FormFieldsA>
  </ErrorBoundary>
)

//#region FormFields

const FormFieldsA = ({
  fields,
  values,
  setValues,
  setLoading
}: FormFieldsProps) => {
  const { categories, store } = useStore()

  const ordersTypesAllowed = Object.entries(store?.orderTypes || {})
    .filter(([key, value]) => value)
    .map((value) => {
      return { label: dictionary(value[0] as order_type), value: value[0] }
    })

  const [sheetRow, setSheetRow] = useState<string | undefined>('')

  useEffect(() => {
    if (!sheetRow) return
    const [
      note = '',
      name = '',
      phone = '',
      neighborhood = '',
      address = '',
      references = '',
      number = '',
      date = ''
    ] = sheetRow?.split('\t') || []

    //const scheduledAt = date && new Date(asDate(date)?.setHours(9))
    const scheduledAt = new Date(date || new Date()) //*<--- FIXME: this is a temporal fix, can't format some dates with 0s from excel

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
      },
      sheetRow
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
      <>
        <TextInfo
          type="warning"
          text="Fila de excel. Las celdas deben estar en el siguiente orden | Nota | Nombre | Teléfono | Colonia | Dirección | Referencias | No.Casa | Fecha programada |"
        ></TextInfo>
        <InputTextStyled
          onChangeText={(text) => setSheetRow(text)}
          placeholder="Fila de excel"
          value={values.sheetRow}
          helperText={'Fila de excel'}
          style={{ borderColor: theme.warning, borderWidth: 2 }}
        />
      </>
    ),
    note: (
      <InputValueFormik
        name={'note'}
        placeholder="Contrato"
        helperText={'Numero de nota o contrato '}
      />
    ),

    fullName: (
      <InputValueFormik
        name={'fullName'}
        placeholder="Nombre completo"
        //helperText={!values.fullName && 'Nombre es requerido'}
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
    imageID: (
      <FormikInputImage
        name="imageID"
        label="Subir identificación"
        onUploading={(progress) => {
          setLoading(true)
          if (progress === 100) setLoading(false)
        }}
      />
    ),
    imageHouse: (
      <FormikInputImage
        name="imageHouse"
        label="Subir fachada "
        onUploading={(progress) => {
          setLoading(true)
          if (progress === 100) setLoading(false)
        }}
      />
    ),
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
      <FormikSelectCategories
        name="items"
        label="Selecciona un artículo"
        selectPrice
        startAt={values.scheduledAt}
      />
    ),
    selectItemsRent: (
      <FormikSelectCategories
        name="items"
        label="Selecciona un artículo"
        selectPrice
        startAt={values.scheduledAt}
      />
    ),
    selectItemsSale: (
      <FormikSelectCategories
        name="items"
        label="Selecciona un artículo"
        selectPrice
        startAt={values.scheduledAt}
      />
    ),
    hasDelivered: (
      <>
        <TextInfo text="Entregada. Útil para ingresar antiguas ordenes al sistema. No recomendable si es un cliente nuevo"></TextInfo>
        <FormikCheckbox
          name="hasDelivered"
          label="Entregada en la fecha programada"
        />
      </>
    ),
    repairDescription: (
      <InputValueFormik
        name={'item.failDescription'}
        placeholder="Describe la falla"
        helperText="Ejemplo: No lava, hace ruido."
      />
    ),
    itemBrand: (
      <InputValueFormik
        name={'item.brand'}
        placeholder="Marca"
        helperText="Ejemplo: Maytag"
      />
    ),
    itemSerial: (
      <InputValueFormik name={'item.serial'} placeholder="No. de serie" />
    ),
    assignIt: <FormikAssignOrder />
    /*
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
      */
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
