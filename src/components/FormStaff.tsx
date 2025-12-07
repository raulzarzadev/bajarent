import { Formik } from 'formik'

import { Dimensions, StyleSheet, Text, View } from 'react-native'
import dictionary from '../dictionary'
import Button from './Button'
import ErrorBoundary from './ErrorBoundary'
import FormikCheckbox from './FormikCheckbox'

const screenWidth = Dimensions.get('window').width

import { useStore } from '../contexts/storeContext'
import { gStyles } from '../styles'
import type StaffType from '../types/StaffType'
import {
	permissionsCustomersKeys,
	permissionsItemsKeys,
	permissionsOrderKeys,
	permissionsStoreKeys,
	staff_roles
} from '../types/StaffType'
import FormikInputValue from './FormikInputValue'

const checkboxWidth = screenWidth > 500 ? '33%' : '50%'

const FormStaff = ({
	defaultValues = {},
	onSubmit = async values => {
		console.log(values)
	}
}: {
	defaultValues?: Partial<StaffType>
	onSubmit?: (values: any) => Promise<void>
}) => {
	const [loading, setLoading] = useState(false)
	const { sections: storeSections } = useStore()

	// * Transform array ['id1', 'id2'] to object { id1: true, id2: true } for the form
	const initialSections = (defaultValues.sectionsAssigned || []).reduce(
		(acc, curr) => ({
			...acc,
			[curr]: true
		}),
		{}
	)

	return (
		<Formik
			initialValues={{
				name: '',
				...defaultValues,
				sectionsAssigned: initialSections
			}}
			onSubmit={async values => {
				try {
					setLoading(true)
					// * Transform object { id1: true, id2: false } back to array ['id1']
					const sectionsArray = Object.entries(values.sectionsAssigned || {})
						.filter(([key, value]) => value === true)
						.map(([key]) => key)

					const valuesToSend = {
						...values,
						sectionsAssigned: sectionsArray
					}

					await onSubmit(valuesToSend).then(console.log).catch(console.error)
				} catch (error) {
					console.error(error)
				} finally {
					setTimeout(() => {
						setLoading(false)
					}, 2000)
				}
			}}
		>
			{({ handleSubmit }) => {
				return (
					<View style={styles.form}>
						<Text style={gStyles.h3}>Permisos especiales</Text>
						<FormikInputValue
							name="name"
							label="Nombre completo"
							placeholder="Nombre del empleado"
							style={styles.input}
						/>
						<View>
							<FormikCheckbox
								style={{
									width: checkboxWidth,
									marginVertical: 4,
									marginHorizontal: 'auto'
								}}
								name={`permissions.isAdmin`}
								label={'Admin'}
							/>
							<>
								<Text style={[gStyles.h3, { textAlign: 'left', marginTop: 12 }]}>Roles</Text>
								<Text style={gStyles.helper}>
									ℹ️ Le permitira acceder a algunas herramientas especificas dentro de la app
								</Text>
								<View
									style={[
										styles.input,
										{
											flexDirection: 'row',
											flexWrap: 'wrap',
											width: '100%',
											justifyContent: 'space-between'
										}
									]}
								>
									{Object.entries(staff_roles).map(([key, label]) => (
										<View style={{ margin: 4 }} key={key}>
											<FormikCheckbox
												disabled={loading}
												label={dictionary(label)}
												name={`roles.${key}`}
											/>
										</View>
									))}
								</View>
							</>

							{/* Areas asingadas */}

							<Text style={[gStyles.h3, { textAlign: 'left', marginTop: 12 }]}>
								Areas asignadas
							</Text>
							<View
								style={{
									flexDirection: 'row',
									flexWrap: 'wrap',
									justifyContent: 'space-evenly'
								}}
							>
								{storeSections?.map(({ name, staff, id }) => (
									<View style={{ margin: 4 }} key={id}>
										<FormikCheckbox
											style={{ width: checkboxWidth, marginVertical: 4 }}
											key={id}
											//name={`permissions.store.${permission}`}
											name={`sectionsAssigned.${id}`}
											label={name}
										/>
									</View>
								))}
							</View>

							{/* Permisos de ordenes */}

							<Text style={[gStyles.h3, { textAlign: 'left', marginTop: 12 }]}>
								Permisos de ordenes
							</Text>
							<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
								{permissionsOrderKeys.map(permission => (
									<FormikCheckbox
										style={{ width: checkboxWidth, marginVertical: 4 }}
										key={permission}
										name={`permissions.order.${permission}`}
										label={dictionary(permission)}
									/>
								))}
							</View>
							<Text style={[gStyles.h3, { textAlign: 'left', marginTop: 12 }]}>
								Permisos de tienda
							</Text>
							<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
								{permissionsStoreKeys.map(permission => (
									<FormikCheckbox
										style={{ width: checkboxWidth, marginVertical: 4 }}
										key={permission}
										name={`permissions.store.${permission}`}
										label={dictionary(permission)}
									/>
								))}
							</View>
							<Text style={[gStyles.h3, { textAlign: 'left', marginTop: 12 }]}>
								Permisos de items
							</Text>
							<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
								{permissionsItemsKeys.map(permission => (
									<FormikCheckbox
										style={{ width: checkboxWidth, marginVertical: 4 }}
										key={permission}
										name={`permissions.items.${permission}`}
										label={dictionary(permission)}
									/>
								))}
							</View>
							<Text style={[gStyles.h3, { textAlign: 'left', marginTop: 12 }]}>
								Permisos de clientes
							</Text>
							<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
								{permissionsCustomersKeys.map(permission => (
									<FormikCheckbox
										style={{ width: checkboxWidth, marginVertical: 4 }}
										key={permission}
										name={`permissions.customers.${permission}`}
										label={dictionary(permission)}
									/>
								))}
							</View>
						</View>

						<View style={styles.input}>
							<Button
								disabled={loading}
								label="Actualizar información"
								onPress={() => {
									handleSubmit()
								}}
							/>
						</View>
					</View>
				)
			}}
		</Formik>
	)
}

export const FormStaffE = props => (
	<ErrorBoundary componentName="FormStaff">
		<FormStaff {...props} />
	</ErrorBoundary>
)

export default FormStaff

const styles = StyleSheet.create({
	form: {
		padding: 0
	},
	input: {
		marginVertical: 10
	},
	permissions: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between'
	},
	permission: {
		margin: 2,
		marginVertical: 8
	}
})
