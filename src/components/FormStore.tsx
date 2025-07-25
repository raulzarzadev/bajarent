import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import FormikInputValue from './FormikInputValue'
import Button from './Button'
import StoreType, { bot_configs } from '../types/StoreType'
import FormikCheckbox from './FormikCheckbox'
import { gStyles } from '../styles'
import FormikInputImage from './FormikInputImage'
import ErrorBoundary from './ErrorBoundary'
import InputLocationFormik from './InputLocationFormik'
import { FormikFieldArrayE } from './FormikInputArray'
import { Separator } from './Separator'
import theme from '../theme'
import dictionary from '../dictionary'

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

  return (
    <Formik
      initialValues={{ name: '', ...defaultValues }}
      onSubmit={async (values) => {
        handleSubmit(values)
      }}
    >
      {({ handleSubmit, values }) => (
        <View>
          <FormikInputImage name="img" label="Portada " />

          <View style={styles.input}>
            <FormikInputValue name={'name'} placeholder="Nombre" />
          </View>
          <View style={styles.input}>
            <FormikInputValue name={'description'} placeholder="Descripción" />
          </View>

          <View style={styles.input}>
            <FormikInputValue name={'address'} placeholder="Dirección" />
          </View>
          <View style={styles.input}>
            <InputLocationFormik name={'location'} />
          </View>

          <View style={styles.input}>
            <FormikInputValue
              name={'schedule'}
              placeholder="Horario"
              helperText="ej. Lun - Sab 8:00am a 6:00pm"
            />
          </View>

          <Separator />
          <FormikFieldArrayE
            label="Contactos"
            name="contacts"
            values={values}
            typeOptions={[
              {
                label: 'Whatsapp',
                value: 'whatsapp',
                type: 'phone'
              },
              {
                label: 'Celular',
                value: 'mobile',
                type: 'phone'
              },
              {
                label: 'Teléfono fijo',
                value: 'phone',
                type: 'phone'
              },
              {
                label: 'Correo',
                value: 'email'
              }
            ]}
          />
          <Separator />
          <FormikFieldArrayE
            label="Redes sociales"
            name="socialMedia"
            values={values}
            typeOptions={[
              { label: 'Página web', value: 'web' },
              {
                label: 'Facebook',
                value: 'facebook'
              },
              {
                label: 'Instagram',
                value: 'instagram'
              },
              {
                label: 'Twitter',
                value: 'twitter'
              },
              {
                label: 'Youtube',
                value: 'youtube'
              },
              {
                label: 'Tiktok',
                value: 'tiktok'
              },
              {
                label: 'Linkedin',
                value: 'linkedin'
              },
              {
                label: 'Otra',
                value: 'other'
              }
            ]}
          />

          <Separator />

          <FormikFieldArrayE
            label="Cuentas bancarias"
            name="bankAccounts"
            values={values}
            typeOptions={[
              {
                label: 'Principal',
                value: 'principal'
              },
              {
                label: 'Secundaria',
                value: 'secondary'
              }
            ]}
            shouldIncludeLabel
          />

          <Separator />

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
          {values.marketVisible && (
            <View style={styles.input}>
              <FormikInputValue
                name={'link'}
                placeholder="Nombre unico"
                helperText="No debe modificarse una vez creado, (agrega - para separar palabras)"
              />
            </View>
          )}
          <Separator />
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

export const FormStoreE = (props) => (
  <ErrorBoundary componentName="FormStore">
    <FormStore {...props} />
  </ErrorBoundary>
)

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
//export const extraFields: FormOrderFields[] = mutableFormOrderFields

// [
//   //'type',//*<- Required already included
//   //'fullName',//*<- Required already included
//   // 'phone',//*<- Required already included

//   //* extra ops config
//   'hasDelivered', //*<- if order has delivered is marked as DELIVERED and its like new item already exists
//   'note', //*<- kind of external reference
//   'sheetRow', //*<- you can paste a google sheet row to get the data much more easy

//   //* address
//   'neighborhood',
//   'address',
//   'location',
//   'references',

//   //* assign
//   // 'scheduledAt',
//   'assignIt',

//   //* repair
//   'itemBrand',
//   'itemSerial',
//   'repairDescription', //*<- Field name is 'description' in the form

//   'quoteDetails',
//   'startRepair',

//   //* images
//   'imageID',
//   'imageHouse'

//   //* select item
//   // 'selectItemsRent',//* <- Included by default
//   // 'selectItemsSale',//* <- Included by default
//   // 'selectItemsRepair'//* <- Included by default
// ]
