import { View, Text, Pressable } from 'react-native'
import React from 'react'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import InputSelect from './InputSelect'
import { useAuth } from '../contexts/authContext'
import { useStore } from '../contexts/storeContext'
import InputDate from './InputDate'
import { useField } from 'formik'
import FormikInputDate from './FormikInputDate'
import FormikInputSelect from './FormikInputSelect'

const FormikAssignOrder = () => {
  return (
    <View>
      <View style={{ marginVertical: 4 }}>
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
      placeholder={'Seleccionar area'}
    />
  )
}

export default FormikAssignOrder
