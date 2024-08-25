import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useField } from 'formik'
import InputAssignSection from './InputAssingSection'
import { gStyles } from '../styles'

const FormikAssignSection = ({ name }) => {
  const [field, meta, helpers] = useField(name)

  return (
    <View>
      <InputAssignSection
        currentSection={field.value}
        setNewSection={async ({ sectionId }) => {
          await helpers.setValue(sectionId)
        }}
      />
      {!!meta.error && <Text style={gStyles.helperError}>{meta.error}</Text>}
    </View>
  )
}

export default FormikAssignSection

const styles = StyleSheet.create({})
