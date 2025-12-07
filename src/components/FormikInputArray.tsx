import { FieldArray } from 'formik'
import { Dimensions, Text, View } from 'react-native'
import { gStyles } from '../styles'
import Button from './Button'
import ErrorBoundary from './ErrorBoundary'
import { FormikInputPhoneE } from './FormikInputPhone'
import FormikInputSelect from './FormikInputSelect'
import FormikInputValue from './FormikInputValue'
export type FormikFieldArrayProps = {
	label?: string
	name: string
	values: unknown
	typeOptions?: {
		label: string
		value: string
		type?: 'phone' | 'number' | 'text'
	}[]
	shouldIncludeLabel?: boolean
}
export const FormikFieldArray = ({
	label,
	name,
	values,
	typeOptions = [],
	shouldIncludeLabel = false
}: FormikFieldArrayProps) => {
	const layoutRow = Dimensions.get('window').width > 500

	return (
		<View>
			<Text style={gStyles.h2}>{label}</Text>
			<FieldArray
				name={name}
				render={arrayHelpers => (
					<View>
						{values[name] && values[name].length > 0 ? (
							values[name].map((field, index) => {
								const typeExist = typeOptions.find(option => option.value === field.type)
								const inputType = typeExist ? typeExist?.type || 'text' : 'text'

								return (
									<View key={index} style={{ flexDirection: 'row', marginVertical: 6 }}>
										<View
											style={{
												flexDirection: layoutRow ? 'row' : 'column',
												flex: 1,
												maxWidth: '100%'
											}}
										>
											{typeOptions.length > 0 && (
												<FormikInputSelect
													name={`${name}.${index}.type`}
													options={typeOptions}
													placeholder="Seleccionar tipo"
												/>
											)}
											{!!typeExist && shouldIncludeLabel && (
												<FormikInputValue
													containerStyle={{ flex: 1 }}
													name={`${name}.${index}.label`}
													placeholder="Etiqueta"
												/>
											)}
											{inputType === 'phone' && (
												<FormikInputPhoneE name={`${name}.${index}.value`} />
											)}
											{inputType === 'number' && (
												<FormikInputValue
													containerStyle={{ flex: 1 }}
													name={`${name}.${index}.value`}
													placeholder="Contenido"
													type="number"
												/>
											)}
											{inputType === 'text' && (
												<FormikInputValue
													containerStyle={{ flex: 1 }}
													name={`${name}.${index}.value`}
													placeholder="Contenido"
												/>
											)}
										</View>
										<View
											style={{
												flexDirection: layoutRow ? 'row' : 'column',
												justifyContent: 'center',
												alignItems: 'center'
											}}
										>
											<Button
												size="xs"
												variant="ghost"
												onPress={() => arrayHelpers.remove(index)} // remove a friend from the list
												icon="sub"
											></Button>
											<Button
												size="xs"
												variant="ghost"
												onPress={() => arrayHelpers.insert(index, '')} // insert an empty string at a position
												icon="add"
											></Button>
										</View>
									</View>
								)
							})
						) : (
							<Button
								onPress={() => arrayHelpers.push('')}
								icon="add"
								size="xs"
								label={`Agregar ${label}`}
							></Button>
						)}
					</View>
				)}
			/>
		</View>
	)
}

export default FormikFieldArray

export const FormikFieldArrayE = (props: FormikFieldArrayProps) => (
	<ErrorBoundary componentName="FormikFieldArray">
		<FormikFieldArray {...props} />
	</ErrorBoundary>
)
