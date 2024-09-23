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
import { useEmployee } from '../contexts/employeeContext'
import TextInfo from './TextInfo'
import theme from '../theme'

const FormItem = ({
  fromOrder,
  onSubmit,
  progress,
  values = {}
}: {
  fromOrder?: boolean
  values?: Partial<ItemType>
  onSubmit?: (values: ItemType) => Promise<any> | void
  progress?: number
}) => {
  const { store, categories, storeSections } = useStore()
  const { permissions } = useEmployee()
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
  const canEditItemStatus =
    permissions.isAdmin || permissions.isOwner || fromOrder
  return (
    <Formik
      initialValues={{ ...defaultValues }}
      onSubmit={async (values: ItemType) => {
        await handleSubmit(values)
      }}
    >
      {({ handleSubmit }) => (
        <View>
          {fromOrder && (
            <TextInfo
              defaultVisible
              text="Estos datos se escriben de forma automática"
            />
          )}
          <View
            style={{
              borderWidth: fromOrder ? 2 : 0,
              borderColor: theme.info,
              padding: 2,
              paddingVertical: 8,
              borderRadius: 4,
              opacity: fromOrder ? 0.5 : 1
            }}
          >
            <FormikInputSelect
              placeholder="Seleccionar estado"
              name={'status'}
              options={itemStatusOptions}
              disabled={!canEditItemStatus}
              helperText="Solo se puede editar si eres administrador"
            />
            <View style={styles.input}>
              <FormikInputValue
                disabled
                label="Numero"
                name={'number'}
                placeholder="Numero"
                helperText="No se puede editar. Se crea de forma automáitca"
              />
            </View>
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
              progress={progress}
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
