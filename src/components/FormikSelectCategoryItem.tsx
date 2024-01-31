import React, { useMemo } from 'react'
import { useField } from 'formik'
import FormSelectItem from './FormSelectItem'
import { Category } from '../types/RentItem'

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
        const priceSelected =
          categories
            ?.find((category) => category?.name === value?.categoryName)
            ?.prices?.find((price) => price?.id === value?.priceSelectedId) ||
          null
        helpers.setValue({
          ...value,
          priceSelected
        })
      }}
      categories={categories}
      label={label}
    />
  )
}

export default FormikSelectCategoryItem
