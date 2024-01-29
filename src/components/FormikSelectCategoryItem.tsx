import React, { useMemo } from 'react'
import { useField } from 'formik'
import FormSelectItem, { Category } from './FormSelectItem'

const FormikSelectCategoryItem = ({
  name,
  label,
  categories
}: {
  name: string
  label?: string
  categories: Category[]
}) => {
  const [field, meta, helpers] = useField(name)
  const value = useMemo(() => field.value, [field.value])

  return (
    <FormSelectItem
      value={value}
      setValue={(value) => {
        helpers.setValue({
          ...value,
          priceSelected: categories
            ?.find((category) => category?.name === value?.categoryName)
            ?.prices?.find((price) => price?.id === value?.priceSelectedId)
        })
      }}
      categories={categories}
      label={label}
    />
  )
}

export default FormikSelectCategoryItem
