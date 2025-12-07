import { useField } from 'formik'
import { useMemo } from 'react'
import type { Category } from '../types/RentItem'
import FormSelectItem from './FormSelectItem'

const FormikSelectCategoryItem = ({
	name,
	label,
	categories,
	selectPrice,
	startAt
}: {
	name: string
	label?: string
	categories: Partial<Category>[]
	selectPrice?: boolean
	startAt?: Date
}) => {
	const [field, meta, helpers] = useField(name)
	const value = useMemo(() => field.value, [field.value])
	return (
		<FormSelectItem
			selectPrice={selectPrice}
			value={value}
			setValue={value => {
				const priceSelected =
					categories
						?.find(category => category?.name === value?.categoryName)
						?.prices?.find(price => price?.id === value?.priceSelectedId) || null
				helpers.setValue({
					...value,
					priceSelected
				})
			}}
			categories={categories}
			label={label}
			startAt={startAt}
		/>
	)
}

export default FormikSelectCategoryItem
