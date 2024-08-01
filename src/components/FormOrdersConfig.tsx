import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Formik } from 'formik'
import { gSpace, gStyles } from '../styles'
import FormikCheckbox from './FormikCheckbox'
import dictionary from '../dictionary'
import {
  FormOrderFields,
  LIST_OF_FORM_ORDER_FIELDS,
  mutableFormOrderFields
} from './FormOrder'
import Button from './Button'
import StoreType from '../types/StoreType'

export type OrdersConfigType = Pick<StoreType, 'orderTypes' | 'orderFields'>

const FormOrdersConfig = ({
  onSubmit,
  defaultValues
}: {
  onSubmit: (values: OrdersConfigType) => Promise<any>
  defaultValues: Partial<OrdersConfigType>
}) => {
  const ordersTypes = ['RENT', 'SALE', 'REPAIR']
  const [isSubmitting, setIsSubmitting] = useState(false)
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
                <View key={type} style={[styles.type]}>
                  <FormikCheckbox
                    name={'orderTypes.' + type}
                    label={dictionary(type)}
                  />
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
