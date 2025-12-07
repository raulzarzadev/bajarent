import InputRadios from './InputRadios'

const FormChooseCategory = ({ categories, setValue, value }) => {
	const options = categories.map(category => ({
		label: category.name,
		value: category.id
	}))
	return (
		<InputRadios
			layout="row"
			options={options}
			setValue={item => {
				setValue(item)
			}}
			value={value}
			label={'Selecciona una categoría'}
			containerStyle={{ flexWrap: 'wrap', justifyContent: 'center' }}
		/>
	)
}

export default FormChooseCategory
