import { Formik } from 'formik'
import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { gStyles } from '../styles'
import type { CategoryType } from '../types/RentItem'
import Button from './Button'
import ErrorBoundary from './ErrorBoundary'
import FormikCheckbox from './FormikCheckbox'
import { FormikFieldArrayE } from './FormikInputArray'
import FormikInputImage from './FormikInputImage'
import FormikInputValue from './FormikInputValue'

export type FormCategoryProps = {
	defaultValues?: Partial<CategoryType>
	onSubmit?: (values: Partial<CategoryType>) => Promise<any>
}
const FormCategoryA = ({
	defaultValues = {},
	onSubmit = async values => {
		console.log(values)
	}
}: FormCategoryProps) => {
	const [sending, setSending] = useState(false)

	return (
		<Formik
			initialValues={{ name: '', ...defaultValues }}
			onSubmit={async values => {
				setSending(true)
				await onSubmit?.(values).then(console.log).catch(console.error)
				setTimeout(() => {
					setSending(false)
				}, 1000)
			}}
		>
			{({ handleSubmit, values }) => (
				<View style={styles.form}>
					<View style={styles.input}>
						<FormikInputValue name={'name'} placeholder="Nombre" />
					</View>
					<View style={styles.input}>
						<FormikInputValue name={'description'} placeholder="Descripción" />
					</View>
					<View style={[styles.input]}>
						<FormikFieldArrayE
							name={'availableBrands'}
							label={'Marcas disponibles'}
							values={values}
						/>
					</View>
					<View style={styles.input}>
						<Text>Visible para tipo de orden: </Text>
						<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
							<FormikCheckbox name={'orderType.rent'} label={'Renta'} style={{ marginRight: 8 }} />
							<FormikCheckbox
								name={'orderType.repair'}
								label={'Reparación'}
								style={{ marginRight: 8 }}
							/>
							<FormikCheckbox name={'orderType.sale'} label={'Venta'} style={{ marginRight: 8 }} />
						</View>
					</View>
					{/* <View style={styles.input}>
            <Text>Tipo de articulo </Text>
            <FormikInputRadios
              name="type"
              options={[
                { label: 'Renta', value: order_type.RENT },
                { label: 'Reparación', value: order_type.REPAIR },
                { label: 'Venta', value: order_type.SALE }
              ]}
            />
          </View> */}
					<View style={styles.input}>
						<FormikInputImage name="img" label="Imagen " />
					</View>

					<View style={[styles.input]}>
						<FormikCheckbox name={'marketVisible'} label={'Mostrar en el mercado'} />
						{!values?.marketVisible && (
							<Text style={[gStyles.helper, { textAlign: 'center' }]}>
								{`Si la tienda no es visible, este producto NO será visible en el mercado`}
							</Text>
						)}
					</View>
					{values?.marketVisible && (
						<View>
							<Text style={gStyles.h2}>Campos del formulario web</Text>
							<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
								<View style={[styles.input, styles.marketCheckbox]}>
									<FormikCheckbox name={'marketForm.price'} label={'Precio'} />
								</View>
								<View style={[styles.input, styles.marketCheckbox]}>
									<FormikCheckbox name={'marketForm.fullName'} label={'Nombre'} />
								</View>
								<View style={[styles.input, styles.marketCheckbox]}>
									<FormikCheckbox name={'marketForm.phone'} label={'Teléfono'} />
								</View>
								<View style={[styles.input, styles.marketCheckbox]}>
									<FormikCheckbox name={'marketForm.neighborhood'} label={'Colonia'} />
								</View>
								<View style={[styles.input, styles.marketCheckbox]}>
									<FormikCheckbox name={'marketForm.address'} label={'Dirección'} />
								</View>
								<View style={[styles.input, styles.marketCheckbox]}>
									<FormikCheckbox name={'marketForm.references'} label={'Referencias'} />
								</View>

								<View style={[styles.input, styles.marketCheckbox]}>
									<FormikCheckbox name={'marketForm.location'} label={'Ubicación'} />
								</View>

								<View style={[styles.input, styles.marketCheckbox]}>
									<FormikCheckbox name={'marketForm.imageId'} label={'Imagen del ID'} />
								</View>

								<View style={[styles.input, styles.marketCheckbox]}>
									<FormikCheckbox name={'marketForm.scheduledAt'} label={'Fecha'} />
								</View>
								<View style={[styles.input, styles.marketCheckbox]}>
									<FormikCheckbox name={'marketForm.chooseBrand'} label={'Seleccionar marca'} />
								</View>
								<View style={[styles.input, styles.marketCheckbox]}>
									<FormikCheckbox
										name={'marketForm.failDescription'}
										label={'Descripción de falla'}
									/>
								</View>
							</View>
						</View>
					)}

					<View style={styles.input}>
						<Button onPress={handleSubmit} label={'Guardar'} disabled={sending} />
					</View>
				</View>
			)}
		</Formik>
	)
}

export default function FormCategory(props: FormCategoryProps) {
	return (
		<ErrorBoundary componentName="FormCategory">
			<FormCategoryA {...props} />
		</ErrorBoundary>
	)
}
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
	},
	marketCheckbox: {
		width: '33%'
	}
})
