import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import FormikInputValue from './FormikInputValue'
import Button from './Button'
import { gStyles } from '../styles'
import { useStore } from '../contexts/storeContext'
import FormikInputSelect from './FormikInputSelect'
import FormikErrorsList from './FormikErrorsList'
import FormikInputRadios from './FormikInputRadios'

export enum type_of_retirement {
  bonus = 'bono',
  expense = 'gasto',
  missing = 'faltate'
}
export type RetirementType = {
  type: keyof typeof type_of_retirement
  amount: number
  description: string
  sectionId: string
  storeId: string
}
const FormRetirement = ({
  onSubmit
}: {
  onSubmit: (retirement: RetirementType) => Promise<any> | void
}) => {
  const { storeSections, storeId } = useStore()
  const initialValues: RetirementType = {
    type: 'bonus',
    amount: 0,
    description: '',
    sectionId: '',
    storeId
  }
  const [loading, setLoading] = React.useState(false)
  return (
    <View>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          try {
            setLoading(true)
            await onSubmit(values)
            setLoading(false)
          } catch (error) {
            console.error(error)
          }
        }}
        validate={(values) => {
          const errors: Partial<RetirementType> = {}
          if (!values.amount) {
            // @ts-ignore
            errors.amount = 'El monto es requerido'
          }

          return errors
        }}
      >
        {({ handleSubmit }) => (
          <View>
            <Text style={gStyles.h2}>Retiro</Text>
            <View style={styles.input}>
              <FormikInputRadios
                name="type"
                label="Tipo de retiro"
                options={[
                  {
                    label: 'Bono',
                    value: 'bonus'
                  },
                  {
                    label: 'Gasto',
                    value: 'expense'
                  },
                  {
                    label: 'Faltante',
                    value: 'missing'
                  }
                ]}
              />
            </View>

            <View style={styles.input}>
              <FormikInputSelect
                name="sectionId"
                label="Selecccionar area"
                placeholder="Seleccionar area"
                options={storeSections.map((section) => ({
                  label: section.name,
                  value: section.id
                }))}
              />
            </View>

            <View style={styles.input}>
              <FormikInputValue name="description" label="Descripción" />
            </View>

            <View style={styles.input}>
              <FormikInputValue
                name="amount"
                type="number"
                placeholder="0.00"
                label="Monto"
                containerStyle={{ maxWidth: 190, margin: 'auto' }}
              />
            </View>
            <View style={styles.input}>
              <FormikErrorsList />
            </View>
            <Button
              disabled={loading}
              onPress={handleSubmit}
              label="Retirar"
              icon={'moneyOff'}
            />
          </View>
        )}
      </Formik>
    </View>
  )
}

export default FormRetirement

const styles = StyleSheet.create({
  input: {
    marginVertical: 8
  }
})
