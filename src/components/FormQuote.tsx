import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import FormikInputValue from './FormikInputValue'
import Button from './Button'
import { OrderQuoteType } from '../types/OrderType'
import useScreenSize from '../hooks/useScreenSize'

const FormQuote = ({
	quote,
	onSubmit
}: {
	quote?: OrderQuoteType
	onSubmit: (values: OrderQuoteType) => void | Promise<void>
}) => {
	const [disabled, setDisabled] = React.useState(false)
	const { isMobile } = useScreenSize()
	return (
		<View>
			<Formik
				onSubmit={async (values, { resetForm }) => {
					setDisabled(true)
					await onSubmit(values)
					setDisabled(false)
					resetForm()
				}}
				initialValues={quote || { description: '', amount: 0 }}
			>
				{({ handleSubmit }) => (
					<View style={{ flexDirection: isMobile ? 'column' : 'row' }}>
						<View style={{ marginRight: 6, marginVertical: 6, flex: 1 }}>
							<FormikInputValue name="description" placeholder="Descripción " />
						</View>
						<View style={{ marginRight: 6, marginVertical: 6 }}>
							<FormikInputValue
								name="amount"
								placeholder="Monto "
								type="number"
								containerStyle={{ width: 100 }}
							/>
						</View>
						<View style={{ marginVertical: 6 }}>
							<Button disabled={disabled} onPress={handleSubmit} icon="add" size="xs" />
						</View>
					</View>
				)}
			</Formik>
		</View>
	)
}

export default FormQuote

const styles = StyleSheet.create({})
