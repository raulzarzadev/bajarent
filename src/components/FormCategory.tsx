import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import FormikInputValue from './InputValueFormik'
import Button from './Button'

import { CategoryType } from '../types/RentItem'
import FormikInputImage from './FormikInputImage'
import FormikCheckbox from './FormikCheckbox'
import { gStyles } from '../styles'
import ErrorBoundary from './ErrorBoundary'
export type FormCategoryProps = {
  defaultValues?: Partial<CategoryType>
  onSubmit?: (values: Partial<CategoryType>) => Promise<any>
}
const FormCategoryA = ({
  defaultValues = {},
  onSubmit = async (values) => {
    console.log(values)
  }
}: FormCategoryProps) => {
  console.log({ defaultValues })
  // @ts-ignore

  const [sending, setSending] = React.useState(false)

  return (
    <Formik
      initialValues={{ name: '', ...defaultValues }}
      onSubmit={async (values) => {
        setSending(true)
        await onSubmit?.(values).then(console.log).catch(console.error)
        setTimeout(() => {
          setSending(false)
        }, 1000)
      }}
    >
      {({ handleSubmit, values }) => (
        <View style={styles.form}>
          <View style={styles.input}>
            <FormikInputValue name={'name'} placeholder="Nombre" />
          </View>
          <View style={styles.input}>
            <FormikInputValue name={'description'} placeholder="Descripción" />
          </View>
          <View style={styles.input}>
            <FormikInputImage name="img" label="Imagen " />
          </View>

          <View style={[styles.input]}>
            <FormikCheckbox
              name={'marketVisible'}
              label={'Mostrar en el mercado'}
            />
            {!values?.marketVisible && (
              <Text style={[gStyles.helper, { textAlign: 'center' }]}>
                {`Si la tienda no es visible, este producto NO sera visible en el mercado`}
              </Text>
            )}
          </View>
          {values?.marketVisible && (
            <View>
              <Text style={gStyles.h2}>Campos del formulario web</Text>
              <View style={[styles.input]}>
                <FormikCheckbox name={'marketForm.price'} label={'Precio'} />
              </View>
              <View style={[styles.input]}>
                <FormikCheckbox name={'marketForm.fullName'} label={'Nombre'} />
              </View>
              <View style={[styles.input]}>
                <FormikCheckbox name={'marketForm.phone'} label={'Teléfono'} />
              </View>
              <View style={[styles.input]}>
                <FormikCheckbox
                  name={'marketForm.neighborhood'}
                  label={'Colonia'}
                />
              </View>
              <View style={[styles.input]}>
                <FormikCheckbox
                  name={'marketForm.address'}
                  label={'Dirección'}
                />
              </View>
              <View style={[styles.input]}>
                <FormikCheckbox
                  name={'marketForm.references'}
                  label={'Referencias'}
                />
              </View>

              <View style={[styles.input]}>
                <FormikCheckbox
                  name={'marketForm.imageId'}
                  label={'Imagen del ID'}
                />
              </View>

              <View style={[styles.input]}>
                <FormikCheckbox
                  name={'marketForm.scheduledAt'}
                  label={'Fecha'}
                />
              </View>
            </View>
          )}

          <View style={styles.input}>
            <Button
              onPress={handleSubmit}
              label={'Guardar'}
              disabled={sending}
            />
          </View>
        </View>
      )}
    </Formik>
  )
}

export default function FormCategory(props: FormCategoryProps) {
  return (
    <ErrorBoundary componentName="FormCategory">
      <FormCategoryA {...props} />
    </ErrorBoundary>
  )
}
const styles = StyleSheet.create({
  form: {
    padding: 0
  },
  input: {
    marginVertical: 10
  },
  permissions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  permission: {
    margin: 2,
    marginVertical: 8
  }
})
