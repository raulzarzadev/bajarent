import { StyleSheet, Text, View } from 'react-native'
import { useState } from 'react'
import { Formik } from 'formik'
import { gSpace, gStyles } from '../styles'
import FormikCheckbox from './FormikCheckbox'
import dictionary from '../dictionary'
import { FormOrderFields, mutableFormOrderFields } from './FormOrder'
import Button from './Button'
import StoreType from '../types/StoreType'
import FormikInputValue from './FormikInputValue'
import ErrorBoundary from './ErrorBoundary'
import { FormikDocumentPickerE } from './FormikDocumentPicker'
import { useStore } from '../contexts/storeContext'

export type OrdersConfigType = Pick<StoreType, 'orderTypes' | 'orderFields'>
export type FormOrdersConfigProps = {
  onSubmit: (values: OrdersConfigType) => Promise<any>
  defaultValues: Partial<OrdersConfigType>
}

const FormOrdersConfig = ({
  onSubmit,
  defaultValues
}: FormOrdersConfigProps) => {
  const { store } = useStore()
  const ordersTypes = ['RENT', 'SALE', 'REPAIR']
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contractValue, setContractValue] = useState('')
  return (
    <View>
      <Formik
        initialValues={defaultValues}
        onSubmit={async (values, { resetForm }) => {
          setIsSubmitting(true)
          await onSubmit(values)
          resetForm({ values })
          setIsSubmitting(false)
        }}
        validate={() => {
          //* TODO validate the form when check items is marked as true validate if fields max and min has a valid value
        }}
      >
        {({ handleSubmit, values, dirty }) => (
          <View>
            <Text style={gStyles.h3}>Tipos de ordenes (recomendado)</Text>

            <Text style={gStyles.helper}>
              Te permitira crear diferentes tipos de ordenes según las
              necesidades de tu negocio
            </Text>
            <View style={[styles.input, styles.type]}>
              {ordersTypes.sort().map((type) => (
                <View
                  key={type}
                  style={[styles.type, { flexDirection: 'column' }]}
                >
                  <FormikCheckbox
                    name={'orderTypes.' + type}
                    label={dictionary(type)}
                  />
                  {values?.orderTypes?.[type] && (
                    <FormikDocumentPickerE
                      fieldName={`${store?.name} ${type} Contrato `}
                      name={`orderTypesContract.${type}`}
                    />
                  )}
                </View>
              ))}
            </View>
            <Text style={gStyles.h3}>Campos por tipo de orden</Text>
            <Text style={gStyles.helper}>
              Te permitira agregar campos personalizados a las ordenes.
            </Text>

            {Object.keys(values?.orderTypes || {}).map((type) => {
              if (!['RENT', 'SALE', 'REPAIR'].includes(type)) return null //<- only show the new types
              if (values.orderTypes[type] === false) return null // <- only config the selected types
              return (
                <View key={type}>
                  <Text
                    style={[
                      gStyles.h2,
                      { textTransform: 'capitalize', marginTop: gSpace(2) }
                    ]}
                  >
                    {dictionary(type)}
                  </Text>
                  <View style={{ flexDirection: 'column' }}>
                    <FormikCheckbox
                      label="Items por orden"
                      name={`orderFields.${type}.validateItemsQty`}
                    ></FormikCheckbox>
                    {values?.orderFields?.[type]?.validateItemsQty && (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-evenly',
                          marginTop: gSpace(1)
                        }}
                      >
                        <FormikInputValue
                          name={`orderFields.${type}.itemsMin`}
                          type="number"
                          style={{ width: 80 }}
                          placeholder="Mínimo "
                          helperText="Minimo"
                        ></FormikInputValue>
                        <FormikInputValue
                          name={`orderFields.${type}.itemsMax`}
                          type="number"
                          style={{ width: 80 }}
                          placeholder="Máximo "
                          helperText="Máximo"
                        ></FormikInputValue>
                      </View>
                    )}
                  </View>
                  <View style={styles.checkboxContainer}>
                    {extraFields.map((field) => (
                      <FormikCheckbox
                        key={field}
                        name={`orderFields.${type}.${field}`}
                        label={dictionary(field)}
                        style={styles.checkbox}
                      />
                    ))}
                  </View>
                </View>
              )
            })}
            <Button
              disabled={isSubmitting || !dirty}
              label="Guardar configuración"
              onPress={handleSubmit}
              fullWidth={false}
              icon="save"
              buttonStyles={{ margin: 'auto', marginVertical: 16 }}
              size="small"
            ></Button>
          </View>
        )}
      </Formik>
    </View>
  )
}

export const FormOrdersConfigE = (props: FormOrdersConfigProps) => (
  <ErrorBoundary componentName="FormOrdersConfig">
    <FormOrdersConfig {...props} />
  </ErrorBoundary>
)

/* ********************************************
 *  SORT of this array change the order of the fields
 *******************************************rz */
export const extraFields: FormOrderFields[] = mutableFormOrderFields.filter(
  (field) => field !== 'type' && field !== 'fullName' && field !== 'phone'
)

// [
//   //'type',//*<- Required already included
//   //'fullName',//*<- Required already included
//   // 'phone',//*<- Required already included

//   'note', //*<- kind of external reference
//   'sheetRow', //*<- you can paste a google sheet row to get the data much more easy

//   //* address
//   'neighborhood',
//   'address',
//   'location',
//   'references',

//   //* Assign date
//   'assignIt',

//   //* repair
//   'itemBrand',
//   'itemSerial',
//   'repairDescription', //*<- Field name is 'description' in the form
//   'quoteDetails',
//   'startRepair',

//   //* images
//   'imageID',
//   'imageHouse',

//   //* Scheduled date
//   'scheduledAt',
//   //* extra ops config
//   'hasDelivered' //*<- if order has delivered is marked as DELIVERED and its like new item already exists

//   //* select item
//   // 'selectItemsRent',//* <- Included by default
//   // 'selectItemsSale',//* <- Included by default
//   // 'selectItemsRepair'//* <- Included by default
// ]

export default FormOrdersConfig

const styles = StyleSheet.create({
  input: {
    marginVertical: 10
  },
  type: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    margin: 4
  },
  checkboxContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  checkbox: { margin: 4 }
})
