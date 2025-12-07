import { Formik } from 'formik'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import type OrderType from '../../types/OrderType'
import Button from '../Button'
import FormikInputValue from '../FormikInputValue'
import InputLocationFormik from '../InputLocationFormik'

const FormRepairDelivery = ({
	initialValues,
	onSubmit,
	setDirty
}: {
	initialValues: Pick<OrderType, 'address' | 'location' | 'references'>
	onSubmit: (values) => Promise<void> | void
	setDirty?: (dirty: boolean) => void
}) => {
	const [loading, setLoading] = useState(false)

	return (
		<View>
			<Formik
				initialValues={initialValues}
				onSubmit={async (values, { resetForm }) => {
					setLoading(true)
					try {
						await onSubmit(values)
						resetForm({ values: values }) // Restablece el formulario a los valores iniciales
					} catch (error) {
						// Manejo de errores, si es necesario
					} finally {
						setLoading(false)
					}
				}}
			>
				{({ handleSubmit, dirty }) => {
					//FIXME: posible loop infinito
					useEffect(() => {
						setDirty?.(dirty)
					}, [dirty])
					return (
						<>
							<FormikInputValue name="address" label="Dirección" />
							<FormikInputValue name="references" label="Referencias de la casa" />
							<InputLocationFormik name="location" />
							<Button
								buttonStyles={{ marginVertical: 12 }}
								label="Actualizar "
								disabled={loading || !dirty}
								onPress={handleSubmit}
							></Button>
						</>
					)
				}}
			</Formik>
		</View>
	)
}

export default FormRepairDelivery
