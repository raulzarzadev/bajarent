import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import FormikInputValue from './InputValueFormik'
import Button from './Button'
import StoreType from '../types/StoreType'
import {
  TypeOrder,
  TypeOrderKes,
  TypeOrderKeys,
  order_type
} from '../types/OrderType'
import dictionary from '../dictionary'
import FormikCheckbox from './FormikCheckbox'
import { gStyles } from '../styles'
import FormikInputImage from './FormikInputImage'

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
  const ordersTypes = TypeOrderKeys
  return (
    <Formik
      initialValues={{ name: '', ...defaultValues }}
      onSubmit={async (values) => {
        handleSubmit(values)
      }}
    >
      {({ handleSubmit }) => (
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

          <Text style={gStyles.h3}>Tipos de ordenes</Text>
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
