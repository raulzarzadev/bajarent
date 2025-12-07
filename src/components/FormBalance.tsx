import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import Button from './Button'
import InputDate from './InputDate'
import { gStyles } from '../styles'
import { BalanceType } from '../types/BalanceType'
import ErrorBoundary from './ErrorBoundary'
import TextInfo from './TextInfo'
import Icon from './Icon'

export type FormBalanceProps = {
	defaultValues?: Partial<BalanceType>
	onSubmit?: (values: Partial<BalanceType>) => Promise<any>
	handleClear?: () => void
}
const FormBalanceE = ({
	handleClear,
	defaultValues,
	onSubmit = async values => {
		console.log(values)
	}
}: FormBalanceProps) => {
	const [submitting, setSubmitting] = React.useState(false)

	const handleSubmit = async (values: Partial<BalanceType>) => {
		setSubmitting(true)

		return await onSubmit(values)
			.then(console.log)
			.catch(() => {
				setSubmitting(false)
			})
			.finally(() => {
				setSubmitting(false)
			})
	}

	const defaultBalanceValues: Partial<BalanceType> = {
		type: 'full',
		fromDate: new Date(new Date().setHours(7, 0, 0, 0)),
		toDate: new Date(new Date().setHours(19, 0, 0, 0)),
		userId: ''
	}
	const initialValues = { ...defaultBalanceValues, ...defaultValues }
	return (
		<Formik
			initialValues={initialValues}
			onSubmit={async values => {
				handleSubmit(values)
			}}
		>
			{({ handleSubmit, setValues, values }) => (
				<View style={gStyles.container}>
					<Text style={[gStyles.h2, { marginBottom: 0 }]}>Fechas</Text>
					<TextInfo
						type="info"
						text="Selecciona las fechas entre las que deseas calcular el balance. "
					/>
					<View style={[styles.input]}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
							{/* SELECT PERIOD OF TIME */}
							<View style={{ justifyContent: 'center' }}>
								<InputDate
									format="E dd/MMM"
									withTime
									label="Desde "
									value={values.fromDate}
									setValue={value => setValues(values => ({ ...values, fromDate: value }), false)}
								/>
							</View>
							<View style={{ alignSelf: 'center' }}>
								<Icon icon="rowRight" />
							</View>
							<View style={{ justifyContent: 'center' }}>
								<InputDate
									withTime
									format="E dd/MMM"
									label="Hasta "
									value={values.toDate}
									setValue={value => setValues(values => ({ ...values, toDate: value }), false)}
								/>
							</View>
						</View>
					</View>

					<View style={[styles.input, { flexDirection: 'row', justifyContent: 'space-around' }]}>
						<Button
							variant="ghost"
							onPress={() => {
								setValues({ ...defaultBalanceValues })
								handleClear?.()
							}}
							label={'Limpiar'}
						/>
						<Button disabled={submitting} onPress={handleSubmit} label={'Calcular'} />
					</View>
				</View>
			)}
		</Formik>
	)
}

export default function FormBalance(props: FormBalanceProps) {
	return (
		<ErrorBoundary componentName="FormBalance">
			<FormBalanceE {...props} />
		</ErrorBoundary>
	)
}

const styles = StyleSheet.create({
	input: {
		marginVertical: 4
	}
})
