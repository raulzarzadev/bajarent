import InputSearch from './Inputs/InputSearch'
import { useField } from 'formik'

type FormikInputSearchProps<T extends { id: string | number }> = {
  name: string
  placeholder?: string
  suggestions?: T[]
  labelKey: keyof T
  maxSuggestions?: number
  style?: any
}

const FormikInputSearch = <T extends { id: string | number }>({
  name,
  placeholder,
  suggestions,
  labelKey,
  maxSuggestions,
  style
}: FormikInputSearchProps<T>) => {
  const [field, meta, helpers] = useField(name)

  return (
    <InputSearch
      placeholder={placeholder}
      suggestions={suggestions}
      labelKey={labelKey}
      maxSuggestions={maxSuggestions}
      style={style}
      onChange={(text) => helpers.setValue(text)}
      onSelect={(selectedItem) =>
        helpers.setValue(selectedItem[labelKey]?.toString() || '')
      }
    />
  )
}

export default FormikInputSearch
