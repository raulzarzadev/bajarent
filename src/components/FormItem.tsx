import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Formik } from 'formik'
import Button from './Button'
import FormikInputValue from './FormikInputValue'
import ItemType, { ItemStatuses } from '../types/ItemType'
import FormikSelectCategories from './FormikSelectCategories'
import FormikInputSelect from './FormikInputSelect'
import { useStore } from '../contexts/storeContext'
import dictionary, { asCapitalize } from '../dictionary'

const FormItem = ({
  onSubmit,
  values = {}
}: {
  values?: Partial<ItemType>
  onSubmit?: (values: ItemType) => Promise<any> | void
}) => {
  const { store, categories, storeSections } = useStore()

  const defaultValues: Partial<ItemType> = { ...values }
  const handleSubmit = async (values: ItemType) => {
    setDisabled(true)
    if (onSubmit) {
      try {
        await onSubmit(values)
      } catch (error) {
        console.log(error)
      } finally {
        setDisabled(false)
      }
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

  const [disabled, setDisabled] = useState(false)
  const itemStatuses = Object.keys(ItemStatuses)
  const itemStatusOptions = Object.values(itemStatuses).map((status) => ({
    label: asCapitalize(dictionary(status)),
    value: status
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
          <FormikInputSelect
            placeholder="Seleccionar estado"
            name={'status'}
            options={itemStatusOptions}
          />
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
          <View style={[{ marginTop: 16 }]}>
            <Button
              onPress={handleSubmit}
              label={'Guardar'}
              disabled={disabled}
            />
          </View>
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
