import React from 'react'
import InputSelect from './InputSelect'
import { useNavigation } from '@react-navigation/native'

const FormSelectCategory = ({ categories, setValue, value }) => {
	const options = categories.map(category => ({
		label: category.name,
		value: category.id
	}))

	return (
		<InputSelect
			options={options}
			placeholder="Seleccionar categoria"
			onChangeValue={value => {
				setValue(value)
			}}
			value={value}
		/>
	)
}

export default FormSelectCategory
