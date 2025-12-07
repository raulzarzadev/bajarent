import { Formik } from 'formik'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { useAuth } from '../../contexts/authContext'
import { useEmployee } from '../../contexts/employeeContext'
import dictionary from '../../dictionary'
import { createUUID } from '../../libs/createId'
import asDate from '../../libs/utils-date'
import { useCustomers } from '../../state/features/costumers/costumersSlice'
import type {
	CustomerType,
	ImageDescriptionType
} from '../../state/features/costumers/customerType'
import { gStyles } from '../../styles'
import Button from '../Button'
import ErrorBoundary from '../ErrorBoundary'
import FormikInputImage from '../FormikInputImage'
import FormikInputSelect from '../FormikInputSelect'
import FormikInputSignature from '../FormikInputSignature'
import FormikInputValue from '../FormikInputValue'
import ImagePreview from '../ImagePreview'
import { ModalEditImages } from '../ImagesInputAndPreview/ModalEditImages'

const CustomerImages = (props?: CustomerImagesProps) => {
	const customerId = props?.customerId
	const showAddButton = props?.canAdd
	const customerPropImages = props?.images

	const { update } = useCustomers()
	const { permissions } = useEmployee()
	const images = props.images

	const handleDeleteImage = async (imageId: string) => {
		update(customerId, { [`images.${imageId}.deletedAt`]: new Date() })
	}

	const customerImages = Object.entries(images || customerPropImages || {})
		.reduce((acc, [id, image]) => {
			if (!image?.deletedAt) acc.push({ ...image, id })
			return acc
		}, [])
		.sort((a, b) => asDate(b?.createdAt)?.getTime() - asDate(a?.createdAt)?.getTime())
	const canDeleteImages = permissions?.orders?.canDelete || permissions?.isAdmin

	if (customerImages.length === 0)
		return (
			<View>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<Text style={gStyles.h3}>Imagenes (cliente) </Text>

					{showAddButton && (
						<ModalEditImages
							handleUpdate={async values => {
								await update(customerId, { [`images.${values?.id}`]: values })
							}}
						/>
					)}
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
				{showAddButton && (
					<ModalEditImages
						handleUpdate={image => {
							update(customerId, { [`images.${createUUID()}`]: image })
						}}
					/>
				)}
			</View>
			<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
				{customerImages?.map(image => (
					<View key={image.id} style={{ margin: 4 }}>
						<ImagePreview
							onDelete={canDeleteImages ? () => handleDeleteImage(image.id) : undefined}
							image={image.src}
							height={100}
							width={100}
							title={dictionary(image.type)}
							description={image.description}
							formValues={image}
							handleSubmitForm={async values => {
								await update(customerId, {
									[`images.${image.id}`]: values
								})
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
							options={[
								{
									label: 'Fachada',
									value: 'house'
								},
								{
									label: 'Identificación',
									value: 'ID'
								},
								{
									label: 'Firma',
									value: 'signature'
								},
								{
									label: 'Artículo',
									value: 'item'
								}
							]}
						/>
						<FormikInputValue
							name="description"
							placeholder="Descripción"
							style={{ marginVertical: 8 }}
						/>
						<View
							style={{
								//height: 100,
								marginVertical: 8,
								justifyContent: 'center'
								//  ...gStyles.guide
							}}
						>
							{values?.type === 'signature' ? (
								<FormikInputSignature name="src" />
							) : (
								<FormikInputImage name="src" />
							)}
						</View>
						<Button onPress={handleSubmit} label="Guardar" disabled={disabled} />
					</View>
				)
			}}
		</Formik>
	)
}
export default CustomerImages
export type CustomerImagesProps = {
	images: CustomerType['images']
	customerId: string
	canAdd?: boolean
}
export const CustomerImagesE = (props: CustomerImagesProps) => (
	<ErrorBoundary componentName="CustomerImages">
		<CustomerImages {...props} />
	</ErrorBoundary>
)
