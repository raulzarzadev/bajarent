import { Formik } from 'formik'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useEmployee } from '../contexts/employeeContext'
import { useStore } from '../contexts/storeContext'
import dictionary, { asCapitalize } from '../dictionary'
import theme from '../theme'
import type ItemType from '../types/ItemType'
import { ItemStatuses } from '../types/ItemType'
import Button from './Button'
import FormikErrorsList from './FormikErrorsList'
import FormikInputSelect from './FormikInputSelect'
import FormikInputValue from './FormikInputValue'
import TextInfo from './TextInfo'

const FormItem = ({
  fromOrder,
  onSubmit,
  progress,
  values = {}
}: {
  fromOrder?: boolean
  values?: Partial<ItemType>
  onSubmit?: (values: ItemType) => Promise<any>
  progress?: number
}) => {
  const { categories, sections: storeSections } = useStore()
  const { permissions } = useEmployee()
  const defaultValues: Partial<ItemType> = { status: 'pickedUp', ...values }
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

  const categoriesOps = categories?.map((category) => ({
    label: category.name,
    value: category.id
  }))
  const sectionsOps = storeSections?.map((section) => ({
    label: section.name,
    value: section.id
  }))

  const [disabled, setDisabled] = useState(false)
  const itemStatuses = Object.keys(ItemStatuses)
  const itemStatusOptions = Object.values(itemStatuses)?.map((status) => ({
    label:
      status === 'pickedUp'
        ? 'Recogido/Disponible'
        : asCapitalize(dictionary(status)),
    value: status
  }))
  const canEditItemStatus =
    permissions.isAdmin ||
    permissions.isOwner ||
    permissions.items.canCreate ||
    fromOrder
  return (
    <Formik
      initialValues={{ ...defaultValues }}
      onSubmit={async (values: ItemType) => {
        await handleSubmit(values)
      }}
      validate={(values) => {
        const errors: any = {}
        if (!values.status) {
          errors.status = 'Selecciona un estado'
        }

        if (!values.category) {
          errors.category = 'Selecciona una categoria'
        }

        return errors
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
              helperText="Solo se puede editar si eres administrador o tienes permisos"
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
              label="Id de inventario"
              name={'sku'}
              placeholder="Id de inventario"
              helperText="Este campo es opcional pero debe ser único"
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
            <FormikErrorsList />
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
