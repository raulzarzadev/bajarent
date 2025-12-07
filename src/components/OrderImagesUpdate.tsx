import { Formik } from 'formik'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { useAuth } from '../contexts/authContext'
import { useEmployee } from '../contexts/employeeContext'
import { useOrderDetails } from '../contexts/orderContext'
import dictionary from '../dictionary'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { createUUID } from '../libs/createId'
import asDate from '../libs/utils-date'
import type { ImageDescriptionType } from '../state/features/costumers/customerType'
import { gStyles } from '../styles'
import Button from './Button'
import ErrorBoundary from './ErrorBoundary'
import FormikInputImage from './FormikInputImage'
import FormikInputSelect from './FormikInputSelect'
import FormikInputValue from './FormikInputValue'
import ImagePreview from './ImagePreview'
import { ModalEditImages } from './ImagesInputAndPreview/ModalEditImages'

const OrderImagesUpdate = (props?: OrderImagesUpdateProps) => {
	const { order } = useOrderDetails()
	const images = order?.orderImages || {}

	const { permissions } = useEmployee()

	const handleDeleteImage = async (imageId: string) => {
		return await ServiceOrders.update(order.id, {
			[`orderImages.${imageId}.deletedAt`]: new Date()
		})
	}
	const handleUpdateImages = async (values: ImageDescriptionType) => {
		return await ServiceOrders.update(order.id, {
			[`orderImages.${createUUID()}`]: {
				...values
			}
		})
	}

	const orderImages = Object.entries(images)
		.reduce((acc, [id, image]) => {
			if (!image?.deletedAt) acc.push({ ...image, id })
			return acc
		}, [])
		.sort((a, b) => asDate(b?.createdAt)?.getTime() - asDate(a?.createdAt)?.getTime())
	const canDeleteImages = permissions?.orders?.canDelete || permissions?.isAdmin

	if (orderImages.length === 0)
		return (
			<View>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<Text style={gStyles.h3}>Imagenes (Orden) </Text>
					<ModalEditImages
						handleUpdate={values => {
							handleUpdateImages(values)
						}}
					/>
				</View>
				<Text style={[gStyles.helper, gStyles.tCenter]}>No hay imagenes</Text>
			</View>
		)
	return (
		<View style={[gStyles.container]}>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<Text style={gStyles.h3}>Imagenes </Text>
				<ModalEditImages
					handleUpdate={values => {
						handleUpdateImages(values)
					}}
				/>
			</View>
			<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
				{orderImages?.map(image => (
					<View key={image.id} style={{ margin: 4 }}>
						<ImagePreview
							onDelete={
								canDeleteImages
									? () => {
											handleDeleteImage(image.id)
										}
									: undefined
							}
							image={image.src}
							height={100}
							width={100}
							title={dictionary(image.type)}
							description={image.description}
							formValues={image}
							handleSubmitForm={async values => {
								handleUpdateImages(values)
								return
							}}
							ComponentForm={FormikImageDescription}
						/>
						<Text>{dictionary(image.type)}</Text>
						<Text style={[gStyles.helper, { maxWidth: 100 }]} numberOfLines={2}>
							{image.description}
						</Text>
					</View>
				))}
			</View>
		</View>
	)
}

export const FormikImageDescription = ({
	handleSubmit,
	values
}: {
	handleSubmit: (values: ImageDescriptionType) => void | Promise<void>
	values?: ImageDescriptionType
}) => {
	const { user } = useAuth()
	const defaultImage: Partial<ImageDescriptionType> = values || {
		type: 'house',
		description: '',
		src: ''
	}
	const [disabled, setDisabled] = useState(false)

	return (
		<Formik
			initialValues={defaultImage}
			onSubmit={async (values: ImageDescriptionType) => {
				setDisabled(true)
				values.createdAt = new Date()
				values.createdBy = user.id
				await handleSubmit(values)
				setDisabled(false)
			}}
		>
			{({ handleSubmit, values }) => {
				return (
					<View>
						<FormikInputSelect
							name="type"
							placeholder="Selecciona tipo de imagen"
							options={[
								{
									label: 'Artículo',
									value: 'item'
								},
								{
									label: 'Fachada',
									value: 'house'
								},
								{
									label: 'Identificación',
									value: 'ID'
								},
								{
									label: 'Otra',
									value: 'other'
								}
							]}
						/>
						<FormikInputValue
							name="description"
							placeholder="Descripción"
							style={{ marginVertical: 8 }}
						/>

						<FormikInputImage name="src" />

						<Button onPress={handleSubmit} label="Guardar" disabled={disabled} />
					</View>
				)
			}}
		</Formik>
	)
}
export default OrderImagesUpdate
export type OrderImagesUpdateProps = {}
export const OrderImagesUpdateE = (props: OrderImagesUpdateProps) => (
	<ErrorBoundary componentName="OrderImagesUpdate">
		<OrderImagesUpdate {...props} />
	</ErrorBoundary>
)
