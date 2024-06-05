import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import Button from './Button'
import FormikInputValue from './FormikInputValue'
import ItemType from '../types/ItemType'
import FormikSelectCategories from './FormikSelectCategories'
import FormikInputSelect from './FormikInputSelect'
import { useStore } from '../contexts/storeContext'

const FormItem = ({
  onSubmit,
  values = {}
}: {
  values: Partial<ItemType>
  onSubmit?: (values: ItemType) => Promise<any> | void
}) => {
  const { store, categories, storeSections } = useStore()

  const defaultValues: Partial<ItemType> = { ...values }
  const handleSubmit = async (values: ItemType) => {
    if (onSubmit) {
      await onSubmit(values)
    }
  }

  const categoriesOps = categories.map((category) => ({
    label: category.name,
    value: category.id
  }))
  const sectionsOps = storeSections?.map((section) => ({
    label: section.name,
    value: section.id
  }))

  return (
    <Formik
      initialValues={{ ...defaultValues }}
      onSubmit={async (values: ItemType) => {
        await handleSubmit(values)
      }}
    >
      {({ handleSubmit }) => (
        <View>
          <View style={styles.input}>
            <FormikInputValue
              label="Numero"
              name={'number'}
              placeholder="Numero"
            />
          </View>
          <View style={styles.input}>
            <FormikInputValue
              label="No. de serie"
              name={'serial'}
              placeholder="No. serie"
            />
          </View>
          <View style={styles.input}>
            <FormikInputValue
              label="Marca"
              name={'brand'}
              placeholder="Marca"
            />
          </View>
          <View style={styles.input}>
            <FormikInputSelect
              label="Categoria"
              name={'category'}
              options={categoriesOps}
              placeholder="Seleccionar categoria"
            />
          </View>
          <View style={styles.input}>
            <FormikInputSelect
              label="Area asignada"
              name={'assignedSection'}
              options={sectionsOps}
              placeholder="Seleccionar area asignada"
            />
          </View>

          <Button onPress={handleSubmit} label={'Guardar'} />
        </View>
      )}
    </Formik>
  )
}

export default FormItem

const styles = StyleSheet.create({
  input: {
    marginVertical: 4
  }
})
