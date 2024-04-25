import { Text, View } from 'react-native'
import React from 'react'
import { useStore } from '../contexts/storeContext'
import FormikInputDate from './FormikInputDate'
import FormikInputSelect from './FormikInputSelect'

const FormikAssignOrder = () => {
  return (
    <View>
      <View style={{ marginVertical: 4, marginBottom: 12 }}>
        <AssignSection />
      </View>
      <View style={{ marginVertical: 4 }}>
        <FormikInputDate
          name={'scheduledAt'}
          label={'Fecha'}
          withTime={false}
        />
      </View>
    </View>
  )
}

const AssignSection = () => {
  const { storeSections } = useStore()
  const options = storeSections.map((section) => ({
    label: section.name,
    value: section.id
  }))

  return (
    <FormikInputSelect
      name={'assignToSection'}
      options={options}
      placeholder={'Asignar area'}
      helperText="Asigna esta orden a un area"
    />
  )
}

export default FormikAssignOrder
