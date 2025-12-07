import { Formik } from 'formik'

import { StyleSheet, Text, View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import type OrderType from '../types/OrderType'
import Button from './Button'
import FormChooseCategory from './FormChooseCategory'
import FormikInputSelect from './FormikInputSelect'
import FormikInputValue from './FormikInputValue'
import FormikSelectCategories from './FormikSelectCategories'
import FormikSelectCategoryItem from './FormikSelectCategoryItem'

const FormRepairItem = ({
	onSubmit,
	defaultValues
}: {
	onSubmit: (values) => Promise<void> | void
	defaultValues?: Partial<OrderType['item']>
}) => {
	const [loading, setLoading] = useState(false)
	const { categories } = useStore()
	return (
		<View>
			<Formik
				initialValues={defaultValues}
				onSubmit={async values => {
					console.log({ values })
					setLoading(true)
					await onSubmit(values)
					setLoading(false)
					return
				}}
			>
				{({ handleChange, handleBlur, handleSubmit, values }) => (
					<View>
						<FormikInputSelect
							options={categories.map(cateogry => ({
								label: cateogry.name,
								value: cateogry.id
							}))}
							name="categoryId"
							placeholder="Selecciona una categoría"
							label="Categoría"
						/>
						<FormikInputValue name="brand" label="Marca" />
						<FormikInputValue name="serial" label="No. serie" />
						<FormikInputValue
							multiline
							numberOfLines={4}
							name="failDescription"
							label="Descripción de falla"
						/>
						<Button
							buttonStyles={{ marginVertical: 8 }}
							disabled={loading}
							label="Guardar"
							onPress={handleSubmit}
						/>
					</View>
				)}
			</Formik>
		</View>
	)
}

export default FormRepairItem

const styles = StyleSheet.create({})
