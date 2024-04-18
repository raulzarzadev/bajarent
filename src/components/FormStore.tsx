import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import FormikInputValue from './InputValueFormik'
import Button from './Button'
import StoreType from '../types/StoreType'
import { TypeOrderKeys, order_type } from '../types/OrderType'
import dictionary from '../dictionary'
import FormikCheckbox from './FormikCheckbox'
import { gSpace, gStyles } from '../styles'
import FormikInputImage from './FormikInputImage'
import { FormOrderFields } from './FormOrder'

const FormStore = ({
  defaultValues,
  onSubmit = async (values) => {
    console.log(values)
  }
}: {
  defaultValues?: Partial<StoreType>
  onSubmit?: (values: Partial<StoreType>) => Promise<any>
}) => {
  const [submitting, setSubmitting] = React.useState(false)
  const handleSubmit = async (values: Partial<StoreType>) => {
    setSubmitting(true)
    return await onSubmit(values)
      .then(console.log)
      .catch(() => {
        setSubmitting(false)
      })
  }
  const oldOrdersTypes = Object.keys(order_type)
  const ordersTypes = TypeOrderKeys

  return (
    <Formik
      initialValues={{ name: '', ...defaultValues }}
      onSubmit={async (values) => {
        handleSubmit(values)
      }}
    >
      {({ handleSubmit, values }) => (
        <View>
          <View style={styles.input}>
            <FormikInputValue name={'name'} placeholder="Nombre" />
          </View>
          <View style={styles.input}>
            <FormikInputValue name={'description'} placeholder="Descripción" />
          </View>

          <View style={styles.input}>
            <FormikInputValue
              name={'link'}
              placeholder="Nombre unico"
              helperText="No debe modificarse una vez creado, (agrega - para separar palabras)"
            />
          </View>

          <FormikInputImage name="img" label="Portada " />

          <Text style={gStyles.h3}>Tipos de ordenes (antiguas)</Text>
          <Text style={gStyles.helper}>
            Te permitira crear diferentes tipos de ordenes según las necesidades
            de tu negocio
          </Text>
          <View style={[styles.input, styles.type]}>
            {oldOrdersTypes.map((type) => (
              <View key={type} style={[styles.type]}>
                <FormikCheckbox
                  name={'orderTypes.' + type}
                  label={dictionary(type as order_type)}
                />
              </View>
            ))}
          </View>
          <Text style={gStyles.h3}>Tipos de ordenes (recomendado)</Text>
          <Text style={gStyles.helper}>
            Te permitira crear diferentes tipos de ordenes según las necesidades
            de tu negocio
          </Text>
          <View style={[styles.input, styles.type]}>
            {ordersTypes.map((type) => (
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

          {Object.keys(values.orderTypes).map((type) => {
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
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {extraFields.map((field) => (
                    <FormikCheckbox
                      key={field}
                      name={`orderFields.${type}.${field}`}
                      label={dictionary(field)}
                    />
                  ))}
                </View>
              </View>
            )
          })}

          <Text style={gStyles.h3}>Secciones</Text>
          <Text style={gStyles.helper}>
            Te dará acceso a herramientas para organizar mejor tu negocio.
          </Text>
          <View style={[styles.input, styles.type]}>
            <FormikCheckbox name={'allowStaff'} label={'Staff'} />
            <FormikCheckbox name={'allowSections'} label={'Areas'} />
          </View>

          <Text style={gStyles.h3}>Visibilidad</Text>
          <Text style={gStyles.helper}>
            {`La tienda será visible en el mercado. (nombre, descripción, imagen y  contacto)`}
          </Text>
          <View style={[styles.input, styles.type]}>
            <FormikCheckbox
              name={'marketVisible'}
              label={'Mostrar en el mercado'}
            />
          </View>

          <View style={styles.input}>
            <Button
              disabled={submitting}
              onPress={handleSubmit}
              label={'Guardar'}
            />
          </View>
        </View>
      )}
    </Formik>
  )
}

export default FormStore

const styles = StyleSheet.create({
  input: {
    marginVertical: 10
  },
  type: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: 4
  }
})

/* ********************************************
 *  SORT of this array change the order of the fields
 *******************************************rz */
export const extraFields: FormOrderFields[] = [
  //'type',//*<- Required already included
  //'fullName',//*<- Required already included
  // 'phone',//*<- Required already included
  // 'selectItems', //*<- Required already included

  //* extra ops
  'note', //*<- kind of external reference
  'sheetRow', //*<- you can paste a google sheet row to get the data much more easy
  'hasDelivered', //*<- if order has delivered is marked as DELIVERED and its like new item already exists

  //* address
  'neighborhood',
  'address',
  'location',
  'references',

  //* assign
  'scheduledAt',
  'assignIt',

  //* repair
  'selectItemRepair',
  'selectItemRent',
  'itemBrand',
  'itemSerial',
  'repairDescription', //*<- Field name is 'description' in the form

  //* images
  'imageID',
  'imageHouse'
]
