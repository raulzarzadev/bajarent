import { Formik } from 'formik'
import { ScrollView, Text, View } from 'react-native'
import { FormikSearchCustomerE } from './FormikSearchCustomer'
import { useCustomers } from '../state/features/costumers/costumersSlice'
import { FormikInputPhoneE } from './FormikInputPhone'
import FormikInputValue from './FormikInputValue'
import InputLocationFormik from './InputLocationFormik'
import FormikInputRadios from './FormikInputRadios'
import { useShop } from '../hooks/useShop'
import dictionary from '../dictionary'
import OrderType, { order_type } from '../types/OrderType'
import FormikAssignSection from './FormikAssingSection'
import ErrorBoundary from './ErrorBoundary'
import { gStyles } from '../styles'
import FormikInputDate from './FormikInputDate'
import { useEmployee } from '../contexts/employeeContext'
import Loading from './Loading'
import FormikInputImage from './FormikInputImage'
import { FormikSelectCategoriesE } from './FormikSelectCategories'
import FormikCheckbox from './FormikCheckbox'
import { FormikSaleOrderItemsE } from './FormikSaleOrderItems'
import { ModalPaymentSale } from './ModalPaymentSale'
import Button from './Button'
import { useState } from 'react'
import { CustomerOrderE } from './Customers/CustomerOrder'
import { CustomerImagesE } from './Customers/CustomerImages'
import FormikErrorsList from './FormikErrorsList'

export type FormOrder2Props = {
  onSubmit: (values: OrderType) => void
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
  const { isEmployeeReady } = useEmployee()
  const { shop } = useShop()
  const initialValues = {
    // Define your initial form values here
    ...defaultValues,
    scheduledAt: defaultValues?.scheduledAt
      ? new Date(defaultValues.scheduledAt)
      : null
  }
  const handleSubmit = (values) => {
    // Handle form submission here
  }
  const ordersTypesAllowed = Object.entries(shop?.orderTypes || {})
    .filter(([key, value]) => value)
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
            //*<---- check if include customer
            //const isCustomerChosen = customerId || values?.customerId
            const isCustomerSet = !!values?.customerId
            console.log({ isCustomerSet, values })
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
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            setFieldValue
          }) => {
            const customerId = values.customerId
            const isCustomerSet = !!values?.customerId
            const excludeCustomer = values?.excludeCustomer
            return (
              <View>
                {/* Your form fields go here */}
                {/* Customer information */}

                {isCustomerSet && (
                  <>
                    <CustomerOrderE
                      customerId={customerId}
                      canViewActions={false}
                    />
                    <View
                      style={{ marginVertical: 8, justifyContent: 'center' }}
                    >
                      <Button
                        size="xs"
                        fullWidth={false}
                        label="Omitir cliente"
                        icon="sub"
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
                    </View>
                  </>
                )}
                {!isCustomerSet && !excludeCustomer && (
                  <View>
                    {/* Customer name */}
                    <FormikSearchCustomerE
                      customers={customers}
                      name={'fullName'}
                      placeholder="Nombre completo y contactos"
                    />
                    {/* Customer phone */}
                    <FormikInputPhoneE name={'phone'} />
                    {/* Customer address */}
                    <FormikInputValue
                      name={'address'}
                      placeholder="Dirección completa (calle, numero y entre calles)"
                      helperText={`Ejemplo: Calle 1 #123 entre Calle 2 y Calle 3`}
                    />
                    <FormikInputValue
                      name={'references'}
                      placeholder="Referencias de la casa"
                      helperText="Ejemplo: Casa blanca con portón rojo"
                    />
                    <InputLocationFormik
                      name={'location'}
                      neighborhood={values.neighborhood}
                      address={values.address}
                    />
                  </View>
                )}

                {/* Aditional data for this order order */}
                <View>
                  <FormikInputValue
                    name={'note'}
                    placeholder="Contrato (opcional)"
                    helperText={'No. de contrato, nota, factura, etc.'}
                  />
                  <FormikInputDate name={'scheduledAt'} withTime />
                </View>

                <View>
                  {/* Order type selection */}
                  <FormikInputRadios
                    name="type"
                    options={ordersTypesAllowed}
                    label="Tipo de orden"
                  />

                  {/* RENT / REPAIR / SALE */}
                </View>
                {/* Order assigned to section */}

                <View>
                  {/* Employee/Section assignment */}
                  <FormikAssignSection name={'assignToSection'} />
                </View>

                {/* Additional order details  */}

                <View>
                  {/* COMMON FIELDS */}
                  {/* SCHEDULED  DATE /  */}
                  {/* Additional order details RENT */}
                  {/* ID, HOUSE, ITEMS,  ALREADY DELIVERED */}

                  {values.type === order_type.RENT && (
                    <>
                      <FormikSelectCategoriesE
                        name="items"
                        label="Selecciona un artículo"
                        selectPrice
                        startAt={values.scheduledAt}
                      />
                      <FormikCheckbox
                        name="hasDelivered"
                        label="Entregada en fecha"
                      />
                    </>
                  )}
                  {/* Additional order details REPAIR */}
                  {values.type === order_type.REPAIR && (
                    <>
                      <FormikInputValue
                        name={'item.brand'}
                        placeholder="Marca"
                        helperText="Ejemplo: Maytag"
                      />
                      <FormikInputValue
                        name={'item.serial'}
                        placeholder="No. de serie"
                      />
                      <FormikInputValue
                        name={'item.model'}
                        placeholder="Modelo"
                        helperText="Año, lote, etc."
                      />
                      <FormikInputValue
                        multiline
                        numberOfLines={3}
                        name={'item.failDescription'}
                        placeholder="Describe la falla"
                        helperText="Ejemplo: Hace ruido, no enciende, etc."
                      />
                      <FormikInputValue
                        multiline
                        numberOfLines={3}
                        name={'quote.description'}
                        placeholder="Descripción de la cotización"
                        helperText="Ejemplo: Cambio de tarjeta"
                      />
                      <FormikInputValue
                        name={'quote.amount'}
                        placeholder="Monto de la cotización"
                        helperText="Ejemplo: 1500"
                        type="number"
                      />
                    </>
                  )}

                  {/* Additional order details SALE */}
                  {values.type === order_type.SALE && (
                    <>
                      {values.excludeCustomer ? (
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
                      <FormikSaleOrderItemsE name="items" />
                      <ModalPaymentSale
                        onSubmit={async () => {
                          //const res = await submitForm()
                          // @ts-ignore orderId can be used for others purposes
                          return { orderId: res?.orderId || null }
                        }}
                      />
                    </>
                  )}
                </View>

                <FormikErrorsList />

                {/* Submit button */}
                <Button
                  disabled={loading || Object.keys(errors).length > 0}
                  onPress={async () => {
                    handleSubmit()
                  }}
                  label={'Guardar'}
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
