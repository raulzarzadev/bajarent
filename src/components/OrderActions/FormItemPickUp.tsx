import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useStore } from '../../contexts/storeContext'
import type ItemType from '../../types/ItemType'
import InputSelect from '../InputSelect'
import InputTextStyled from '../InputTextStyled'

const FormItemPickUp = ({
	item,
	onChange
}: {
	item: Partial<ItemType>
	onChange?: (item: Partial<ItemType>) => void
}) => {
	const { categories, sections: storeSections } = useStore()
	const section = storeSections.find(section => section?.id === item?.assignedSection)
	const category = categories.find(
		category => category?.id === item?.category || category?.name === item?.categoryName
	)
	const [values, setValues] = useState<Partial<ItemType>>({
		...item,
		category: category?.id,
		assignedSection: section?.id
	})
	const handleChange = value => {
		setValues(value)
		onChange(value)
	}
	useEffect(() => {
		onChange(values)
	}, [])
	return (
		<View>
			<InputText placeholder="Numero" name="number" onChange={handleChange} values={values} />
			<InputText placeholder="No. de serie" name="serial" onChange={handleChange} values={values} />
			<InputText placeholder="Marca" name="brand" onChange={handleChange} values={values} />
			<InputSelect
				style={styles.input}
				placeholder="Seleccionar categoría"
				options={categories.map(category => ({
					label: category.name,
					value: category.id
				}))}
				value={values.category}
				onChangeValue={value => {
					handleChange({ ...values, category: value })
				}}
			/>
			<InputSelect
				style={styles.input}
				placeholder="Area asignada"
				options={storeSections.map(section => ({
					label: section.name,
					value: section.id
				}))}
				value={values.assignedSection}
				onChangeValue={value => {
					handleChange({ ...values, assignedSection: value })
				}}
			/>
			{/* <InputText
        placeholder="Categoria"
        name="category"
        onChange={handleChange}
        values={values}
      /> */}
		</View>
	)
}

const InputText = ({
	name,
	onChange,
	values,
	placeholder
}: {
	name: string
	onChange: (values: Partial<ItemType>) => void
	values: Partial<ItemType>
	placeholder: string
}) => {
	return (
		<InputTextStyled
			placeholder={placeholder}
			value={values[name]}
			onChangeText={value => {
				onChange({ ...values, [name]: value })
			}}
			style={styles.input}
		/>
	)
}

export default FormItemPickUp

const styles = StyleSheet.create({
	input: { marginVertical: 8 }
})
