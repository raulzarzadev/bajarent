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
import theme from '../theme'
import FormikAssignOrder from './FormikAssignOrder'
import FormikSelectCategories from './FormikSelectCategories'
import Loading from './Loading'
import TextInfo from './TextInfo'
import { useEmployee } from '../contexts/employeeContext'
import FormikErrorsList from './FormikErrorsList'

export const LIST_OF_FORM_ORDER_FIELDS = [
  'type',
  'fullName',
  'phone',
  'scheduledAt',
  'address',
  'location',
  'neighborhood',
  'references',
  ,
  'imageID',
  'imageHouse',
  'assignIt',

  'hasDelivered',
  'sheetRow',
  'note',

  //'selectItemsRent',
  //'selectItemsSale',

  //Repairs
  'itemBrand',
  'itemModel',
  'itemSerial',
  'repairDescription', // Field name is 'description' in the form
  'quoteDetails',
  'startRepair',
  'selectItems'

  // 'folio'
] as const

//#region FUNCTIONS
type OrderFields = Partial<Record<FormOrderFields, boolean>>

export type FormOrderFields = (typeof LIST_OF_FORM_ORDER_FIELDS)[number] & {
  validateItemsQty?: boolean
  itemsMin?: number
  itemsMax?: number
}

export const mutableFormOrderFields: FormOrderFields[] = [
  ...LIST_OF_FORM_ORDER_FIELDS
]
const initialValues: Partial<OrderType> = {
  firstName: '',
  fullName: '',
  phone: '',
  // scheduledAt: new Date(),
  // type: order_type.RENT,
  address: '',
  scheduledAt: new Date()
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

  const { employee } = useEmployee()
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

  if (!store || !employee) return <Loading />
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
        {!!error && (
          <Text style={[gStyles.p, { color: theme.error }]}>{error}</Text>
        )}
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, { resetForm }) => {
            setLoading(true)
            setError(null)

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
            if (!values.fullName) errors.fullName = 'Nombre necesario'
            if (!values.phone || values.phone.length < 12)
              errors.phone = 'Teléfono valido es necesario'

            const ITEMS_MAX_BY_ORDER =
              store?.orderFields?.[values.type]?.itemsMax
            const ITEMS_MIN_BY_ORDER =
              store?.orderFields?.[values.type]?.itemsMin
            const VALIDATE_ITEMS_QTY =
              store?.orderFields?.[values.type]?.validateItemsQty
            /* ********************************************
             * Very Important to validate items quantity
             *******************************************rz */
            const itemsCount = values?.items?.length || 0
            if (VALIDATE_ITEMS_QTY) {
              // if (itemsCount === 0)
              //   //@ts-ignore
              //   errors.items = 'Artículos necesarios'
              if (ITEMS_MIN_BY_ORDER && itemsCount < ITEMS_MIN_BY_ORDER)
                //@ts-ignore
                errors.items = `Selecciona mínimo ${ITEMS_MIN_BY_ORDER} artículo(s)`
              if (ITEMS_MAX_BY_ORDER && itemsCount > ITEMS_MAX_BY_ORDER)
                //@ts-ignore
                errors.items = `Selecciona máximo ${ITEMS_MAX_BY_ORDER} artículo(s)`
            }
            /* ********************************************
             * If orders has delivered, then must have a scheduled date
             *******************************************rz */

            if (values.hasDelivered && !values.scheduledAt)
              //@ts-ignore
              errors.scheduledAt = 'Fecha  necesaria'

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

                {/* <View>
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
                )} */}
                <FormikErrorsList />

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
  const { store } = useStore()
  const { employee } = useEmployee()
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

  useEffect(() => {
    if (employee.sectionsAssigned.length > 0) {
      setValues({
        ...values,
        assignToSection: values.assignToSection || employee.sectionsAssigned[0]
      })
    }
  }, [employee.sectionsAssigned])

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
        {/* <TextInfo
          type="warning"
          text="Fila de excel. Las celdas deben estar en el siguiente orden | Nota | Nombre | Teléfono | Colonia | Dirección | Referencias | No.Casa | Fecha programada |"
        ></TextInfo> */}
        <InputTextStyled
          onChangeText={(text) => setSheetRow(text)}
          placeholder="Fila de excel"
          value={values.sheetRow}
          helperText={
            'Fila de excel | Nota | Nombre | Teléfono | Colonia | Dirección | Referencias | '
          }
          style={{
            borderColor: theme.warning,
            borderWidth: 4
          }}
        />
      </>
    ),
    note: (
      <InputValueFormik
        name={'note'}
        placeholder="Contrato (opcional)"
        helperText={'No. de contrato, nota, factura, etc.'}
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
        label="Fecha"
        value={asDate(values.scheduledAt) || new Date()}
        setValue={(value) =>
          setValues({ ...values, scheduledAt: value }, false)
        }
      />
    ),
    selectItems: (
      <FormikSelectCategories
        name="items"
        label="Selecciona un artículo"
        selectPrice
        startAt={values.scheduledAt}
      />
    ),

    hasDelivered: (
      <>
        {/* <TextInfo text="Entregada. Útil para ingresar antiguas ordenes al sistema. No recomendable si es un cliente nuevo"></TextInfo> */}
        <FormikCheckbox name="hasDelivered" label="Entregada en fecha" />
      </>
    ),
    repairDescription: (
      <InputValueFormik
        multiline
        numberOfLines={3}
        name={'item.failDescription'}
        placeholder="Describe la falla"
        helperText="Ejemplo: Hace ruido, no enciende, etc."
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
    itemModel: (
      <InputValueFormik
        name={'item.model'}
        placeholder="Modelo"
        helperText="Año, lote, etc."
      />
    ),
    assignIt: <FormikAssignOrder />,
    quoteDetails: (
      <>
        <View style={[styles.item]}>
          <InputValueFormik
            multiline
            numberOfLines={3}
            name={'quote.description'}
            placeholder="Descripción de la cotización"
            helperText="Ejemplo: Cambio de tarjeta"
          />
        </View>
        <View style={[styles.item]}>
          <InputValueFormik
            name={'quote.amount'}
            placeholder="Monto de la cotización"
            helperText="Ejemplo: 1500"
            type="number"
          />
        </View>
      </>
    ),

    startRepair: (
      <FormikCheckbox name="startRepair" label="Comenzar reparación" />
    )
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

export const getOrderFields = (fields: OrderFields): FormOrderFields[] => {
  //* extra ops config
  //* add extra ops config at the really first of the form
  const mandatoryFieldsStart: FormOrderFields[] = ['fullName', 'phone']
  let mandatoryFieldsEnd: FormOrderFields[] = []
  let addedFields: FormOrderFields[] = []

  const extraOpsStarts = ['sheetRow', 'note']?.filter(
    (field) => !!fields?.[field]
  ) as FormOrderFields[]

  const extraOpsEnds = [
    'startRepair',
    'hasDelivered', //*<- if order has delivered is marked as DELIVERED and its like new item already exists
    'scheduledAt'
  ]?.filter((field) => !!fields?.[field]) as FormOrderFields[]

  // if (type === TypeOrder.RENT) mandatoryFieldsEnd = ['selectItems']
  // // if (type === TypeOrder.REPAIR) mandatoryFieldsEnd = ['selectItemsRepair']
  // if (type === TypeOrder.SALE) mandatoryFieldsEnd = ['selectItems']

  const extraFieldsAllowed = LIST_OF_FORM_ORDER_FIELDS?.filter(
    (field) => fields?.[field]
  )
    //* clear extra ops because are already included at the first of the form
    ?.filter((field) => ![...extraOpsEnds, ...extraOpsStarts].includes(field))

  addedFields = extraFieldsAllowed
  const res = [
    ...extraOpsStarts,
    ...mandatoryFieldsStart,
    ...addedFields,
    ...mandatoryFieldsEnd,
    ...extraOpsEnds
  ]
  const removeDuplicates = [...new Set(res)]
  //console.log({ res })
  return removeDuplicates
}
