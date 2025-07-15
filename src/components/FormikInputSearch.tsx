import InputSearch from './Inputs/InputSearch'
import { useField, useFormikContext } from 'formik'

type FormikInputSearchProps<T extends { id: string | number }> = {
  name: string
  placeholder?: string
  suggestions?: T[]
  labelKey: keyof T
  maxSuggestions?: number
  style?: any
}
/**
 * Formik wrapper for the InputSearch Client component
 * @param param0 FormikInputSearchProps
 * @returns
 */

//TODO: is a input search for clients
const FormikInputSearch = <T extends { id: string | number }>({
  name,
  placeholder,
  suggestions,
  labelKey,
  maxSuggestions,
  style
}: FormikInputSearchProps<T>) => {
  const [field, meta, helpers] = useField(name)
  const formik = useFormikContext()
  return (
    <InputSearch
      placeholder={placeholder}
      suggestions={suggestions}
      labelKey={labelKey}
      maxSuggestions={maxSuggestions}
      style={style}
      onChange={(text) => helpers.setValue(text)}
      onSelect={(selectedItem) => {
        helpers.setValue(selectedItem[labelKey]?.toString() || '')
        formik.setFieldValue('customerId', selectedItem.id)
      }}
    />
  )
}

export default FormikInputSearch
