import { Formik } from 'formik'
import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useEmployee } from '../contexts/employeeContext'
import dictionary from '../dictionary'
import { useShop } from '../hooks/useShop'
import catchError from '../libs/catchError'
import { useCustomers } from '../state/features/costumers/costumersSlice'
import { gStyles } from '../styles'
import type OrderType from '../types/OrderType'
import { order_type } from '../types/OrderType'
import Button from './Button'
import { CustomerOrderE } from './Customers/CustomerOrder'
import ErrorBoundary from './ErrorBoundary'
import FormikAssignSection from './FormikAssingSection'
import FormikCheckbox from './FormikCheckbox'
import FormikErrorsList from './FormikErrorsList'
import FormikInputDate from './FormikInputDate'
import { FormikInputPhoneE } from './FormikInputPhone'
import FormikInputRadios from './FormikInputRadios'
import FormikInputValue from './FormikInputValue'
import { FormikSaleOrderItemsE } from './FormikSaleOrderItems'
import { FormikSearchCustomerE } from './FormikSearchCustomer'
import { FormikSelectCategoriesE } from './FormikSelectCategories'
import InputLocationFormik from './InputLocationFormik'
import Loading from './Loading'

export type FormOrder2Props = {
  onSubmit: (values: OrderType) => Promise<any>
  defaultValues?: Partial<OrderType>
  title?: string
}

export const FormOrder2 = ({
  onSubmit,
  defaultValues,
  title
}: FormOrder2Props) => {
  const [loading, setLoading] = useState(false)

  const { data: customers } = useCustomers()
  if (__DEV__) console.log('DEV:', { customers })
  const { isEmployeeReady } = useEmployee()
  const { shop } = useShop()
  console.log({ defaultValues })
  const defaultOrderType =
    defaultValues.type || shop?.orderTypes.RENT
      ? order_type.RENT
      : order_type.REPAIR

  const initialValues: Partial<OrderType> = {
    // Define your initial form values here
    type: defaultOrderType,
    ...defaultValues,
    scheduledAt: null
  }
  const handleSubmit = async (values) => {
    // Handle form submission here
    setLoading(true)

    const [err, res] = await catchError(onSubmit(values))
    if (err) {
      console.error('Error submitting form:', err)
    }
    if (res) {
      //console.log('Form submitted successfully:', res)
    }
    setLoading(false)
  }
  const ordersTypesAllowed = Object.entries(shop?.orderTypes || {})
    .filter(([_, value]) => value)
    .map((value) => {
      return { label: dictionary(value[0] as order_type), value: value[0] }
    })
  if (!isEmployeeReady) return <Loading id="employee-not-ready" />

  return (
    <ScrollView>
      {title && <Text style={gStyles.h3}>{title}</Text>}
      <View style={[gStyles.container]}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validate={(values: Partial<OrderType>) => {
            const errors: Partial<OrderType> = {}

            const isRent = values.type === order_type.RENT
            const isRepair = values.type === order_type.REPAIR
            //*<---- check if include customer
            //const isCustomerChosen = customerId || values?.customerId
            const isCustomerSet = !!values?.customerId
            if (isRent || isRepair)
              if (!isCustomerSet) {
                if (!values.fullName) errors.fullName = 'Nombre necesario'
                if (!values.phone || values.phone.length < 12)
                  errors.phone = 'Teléfono valido es necesario'
              }

            const ITEMS_MAX_BY_ORDER =
              shop?.orderFields?.[values.type]?.itemsMax
            const ITEMS_MIN_BY_ORDER =
              shop?.orderFields?.[values.type]?.itemsMin

            //* <- Validate items quantity if is required
            const VALIDATE_ITEMS_QTY =
              shop?.orderFields?.[values.type]?.validateItemsQty &&
              values.hasDelivered
            /* ********************************************
             * Very Important to validate items quantity
             *******************************************rz */
            const itemsCount = values?.items?.length || 0
            if (VALIDATE_ITEMS_QTY) {
              // if (itemsCount === 0)
              //   //@ts-expect-error
              //   errors.items = 'Artículos necesarios'
              if (ITEMS_MIN_BY_ORDER && itemsCount < ITEMS_MIN_BY_ORDER)
                //@ts-expect-error
                errors.items = `Selecciona mínimo ${ITEMS_MIN_BY_ORDER} artículo(s)`
              if (ITEMS_MAX_BY_ORDER && itemsCount > ITEMS_MAX_BY_ORDER)
                //@ts-expect-error
                errors.items = `Selecciona máximo ${ITEMS_MAX_BY_ORDER} artículo(s)`
            }
            /* ********************************************
             * If orders has delivered, then must have a scheduled date
             *******************************************rz */

            if (values.hasDelivered && !values.scheduledAt)
              //@ts-expect-error
              errors.scheduledAt = 'Fecha  necesaria'

            return errors
          }}
        >
          {({ handleSubmit, values, errors, setFieldValue }) => {
            const customerId = values.customerId
            const isCustomerSet = !!values?.customerId
            const excludeCustomer = values?.excludeCustomer
            return (
              <View>
                {/* Your form fields go here */}
                <ViewInputForm>
                  {/* Order type selection */}
                  <FormikInputRadios
                    name="type"
                    options={ordersTypesAllowed}
                    label="Tipo de orden"
                  />
                  {values.type === order_type.SALE && (
                    <ViewInputForm>
                      {!!values.excludeCustomer ? (
                        <Button
                          label="Agregar cliente"
                          onPress={() => {
                            setFieldValue('excludeCustomer', false)
                          }}
                          size="xs"
                        ></Button>
                      ) : (
                        <Button
                          label="Orden sin cliente"
                          onPress={() => {
                            setFieldValue('excludeCustomer', true)
                            setFieldValue('customerId', null)
                          }}
                          size="xs"
                        ></Button>
                      )}
                    </ViewInputForm>
                  )}

                  {/* RENT / REPAIR / SALE */}
                </ViewInputForm>
                {/* Customer information */}
                {!!isCustomerSet && (
                  <>
                    <ViewInputForm>
                      <CustomerOrderE
                        customerId={customerId}
                        canViewActions={false}
                      />
                    </ViewInputForm>
                    <ViewInputForm>
                      <Button
                        size="xs"
                        fullWidth={false}
                        label="Cliente nuevo"
                        icon="customerCard"
                        buttonStyles={{ margin: 'auto' }}
                        onPress={() => {
                          setFieldValue('customerId', null)
                        }}
                      />
                      <Text
                        style={[
                          gStyles.helper,
                          gStyles.tCenter,
                          { opacity: 0.7 }
                        ]}
                      >
                        * Al omitir cliente se borraran los datos y se podra
                        crear una orden sin cliente.
                      </Text>
                    </ViewInputForm>
                  </>
                )}
                {!isCustomerSet && !excludeCustomer && (
                  <>
                    {/* Customer name */}
                    <ViewInputForm>
                      <FormikSearchCustomerE
                        customers={customers}
                        name={'fullName'}
                        placeholder="Nombre completo y contactos"
                      />
                    </ViewInputForm>
                    {/* Customer phone */}
                    <ViewInputForm>
                      <FormikInputPhoneE name={'phone'} />
                    </ViewInputForm>
                    {/* Customer address */}

                    <ViewInputForm>
                      <FormikInputValue
                        name={'neighborhood'}
                        placeholder="Colonia / Barrio"
                        helperText="Ejemplo: Centro, Roma, La Florida"
                      />
                    </ViewInputForm>

                    <ViewInputForm>
                      <FormikInputValue
                        name={'address'}
                        placeholder="Dirección completa (calle, numero y entre calles)"
                        helperText={`Ejemplo: Calle 1 #123 entre Calle 2 y Calle 3`}
                      />
                    </ViewInputForm>

                    {/* Additional location info */}
                    <ViewInputForm>
                      <FormikInputValue
                        name={'references'}
                        placeholder="Referencias de la casa"
                        helperText="Ejemplo: Casa blanca con portón rojo"
                      />
                    </ViewInputForm>
                    <ViewInputForm>
                      <InputLocationFormik
                        name={'location'}
                        neighborhood={values.neighborhood}
                        address={values.address}
                      />
                    </ViewInputForm>
                  </>
                )}

                {/* Aditional data for this order order */}
                <ViewInputForm>
                  <FormikInputValue
                    name={'note'}
                    placeholder="Contrato (opcional)"
                    helperText={'No. de contrato, nota, factura, etc.'}
                  />
                </ViewInputForm>

                <ViewInputForm>
                  {values.scheduledAt ? (
                    <View>
                      <Button
                        onPress={() => setFieldValue('scheduledAt', null)}
                        icon="close"
                        label="Quitar fecha"
                        size="xs"
                        variant="ghost"
                      ></Button>
                      <FormikInputDate name={'scheduledAt'} withTime />
                    </View>
                  ) : (
                    <Button
                      onPress={() => setFieldValue('scheduledAt', new Date())}
                      icon="calendar"
                      variant="ghost"
                      label="Programar fecha"
                    ></Button>
                  )}
                </ViewInputForm>

                {/* Order assigned to section */}

                <ViewInputForm>
                  {/* Employee/Section assignment */}
                  <FormikAssignSection name={'assignToSection'} />
                </ViewInputForm>

                {/* Additional order details  */}

                {/* COMMON FIELDS */}
                {/* SCHEDULED  DATE /  */}
                {/* Additional order details RENT */}
                {/* ID, HOUSE, ITEMS,  ALREADY DELIVERED */}

                {values.type === order_type.RENT && (
                  <>
                    <ViewInputForm>
                      <FormikSelectCategoriesE
                        name="items"
                        label="Selecciona un artículo"
                        selectPrice
                        startAt={values.scheduledAt}
                      />
                    </ViewInputForm>
                    <ViewInputForm>
                      <FormikCheckbox
                        name="hasDelivered"
                        label="Entregada en fecha"
                      />
                    </ViewInputForm>
                  </>
                )}
                {/* Additional order details REPAIR */}
                {values.type === order_type.REPAIR && (
                  <>
                    <ViewInputForm>
                      <FormikInputValue
                        name={'item.brand'}
                        placeholder="Marca"
                        helperText="Ejemplo: Maytag"
                      />
                    </ViewInputForm>
                    <ViewInputForm>
                      <FormikInputValue
                        name={'item.serial'}
                        placeholder="No. de serie"
                      />{' '}
                    </ViewInputForm>
                    <ViewInputForm>
                      <FormikInputValue
                        name={'item.model'}
                        placeholder="Modelo"
                        helperText="Año, lote, etc."
                      />{' '}
                    </ViewInputForm>
                    <ViewInputForm>
                      <FormikInputValue
                        multiline
                        numberOfLines={3}
                        name={'item.failDescription'}
                        placeholder="Describe la falla"
                        helperText="Ejemplo: Hace ruido, no enciende, etc."
                      />{' '}
                    </ViewInputForm>
                    <ViewInputForm>
                      <FormikInputValue
                        multiline
                        numberOfLines={3}
                        name={'quote.description'}
                        placeholder="Descripción de la cotización"
                        helperText="Ejemplo: Cambio de tarjeta"
                      />{' '}
                    </ViewInputForm>
                    <ViewInputForm>
                      <FormikInputValue
                        name={'quote.amount'}
                        placeholder="Monto de la cotización"
                        helperText="Ejemplo: 1500"
                        type="number"
                      />{' '}
                    </ViewInputForm>
                  </>
                )}

                {/* Additional order details SALE */}
                {values.type === order_type.SALE && (
                  <ViewInputForm>
                    <FormikSaleOrderItemsE name="items" />
                  </ViewInputForm>
                )}

                <FormikErrorsList />

                {/* Submit button */}
                <Button
                  disabled={loading || Object.keys(errors).length > 0}
                  onPress={async () => {
                    handleSubmit()
                  }}
                  label={'Guardar'}
                  icon="save"
                  color="success"
                  buttonStyles={{ marginHorizontal: 'auto', marginVertical: 8 }}
                />
              </View>
            )
          }}
        </Formik>
      </View>
    </ScrollView>
  )
}

export const FormOrder2E = (props: FormOrder2Props) => (
  <ErrorBoundary componentName="FormOrder2">
    <FormOrder2 {...props} />
  </ErrorBoundary>
)

export const ViewInputForm = ({ children }) => {
  return <View style={{ marginVertical: 8 }}>{children}</View>
}
