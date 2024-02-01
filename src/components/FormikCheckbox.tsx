import React, { useMemo } from 'react'
import { useField } from 'formik'
import BouncyCheckbox from 'react-native-bouncy-checkbox'

const FormikCheckbox = ({ name, label }: { name: string; label?: string }) => {
  const [field, meta, helpers] = useField(name)
  const value = useMemo(() => field.value, [field.value])

  return (
    <BouncyCheckbox
      style={{ marginHorizontal: 'auto' }}
      textStyle={{
        textDecorationLine: 'none'
      }}
      isChecked={value}
      onPress={(isChecked: boolean) => {
        helpers.setValue(isChecked)
      }}
      text={label}
    />
  )
}

export default FormikCheckbox
