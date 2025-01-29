import { View, Text, Pressable } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { gStyles } from '../../styles'
import {
  CustomerType,
  ImageDescriptionType
} from '../../state/features/costumers/customerType'
import Icon from '../Icon'
import useModal from '../../hooks/useModal'
import StyledModal from '../StyledModal'
import FormikInputImage from '../FormikInputImage'
import { Formik } from 'formik'
import FormikInputSelect from '../FormikInputSelect'
import FormikInputValue from '../FormikInputValue'
import FormikInputSignature from '../FormikInputSignature'
import Button from '../Button'
import { createUUID } from '../../libs/createId'
import ImagePreview from '../ImagePreview'
import { useCustomers } from '../../state/features/costumers/costumersSlice'
import { useAuth } from '../../contexts/authContext'
import asDate from '../../libs/utils-date'

const FormCustomerImages = (props?: FormCustomerImagesProps) => {
  const customerId = props?.customerId
  const { update, data } = useCustomers()
  const images = data?.find((c) => c.id === props.customerId).images || {}
  const modal = useModal({ title: 'Agregar imagen' })
  const handleAddCustomerImage = async (image: ImageDescriptionType) => {
    const imageId = createUUID({ length: 8 })
    await update(customerId, { [`images.${imageId}`]: image })
    modal.toggleOpen()
  }
  const handleDeleteImage = async (imageId: string) => {
    update(customerId, { [`images.${imageId}.deletedAt`]: new Date() })
  }
  const customerImages = Object.entries(images)
    .reduce((acc, [id, image]) => {
      if (!image.deletedAt) acc.push({ ...image, id })
      return acc
    }, [])
    .sort(
      (a, b) => asDate(b?.createdAt).getTime() - asDate(a?.createdAt).getTime()
    )
  return (
    <View>
      <Text style={gStyles.h3}>Imagenes</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Pressable
          onPress={modal.toggleOpen}
          style={({ pressed }) => ({
            width: 100,
            height: 100,
            borderWidth: 2,
            borderStyle: 'dashed',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: {
              width: 2,
              height: 2
            },
            shadowRadius: 6,
            shadowOpacity: pressed ? 0.5 : 0.2,
            margin: 4
          })}
        >
          <Icon icon="add" size={60} />
        </Pressable>

        {customerImages?.map((image) => (
          <View key={image.id} style={{ margin: 4 }}>
            <ImagePreview
              onDelete={() => {
                handleDeleteImage(image.id)
              }}
              image={image.src}
              height={100}
              width={100}
              title={image.type}
            />
            <Text>{image.type}</Text>
            <Text style={gStyles.helper}>{image.description}</Text>
          </View>
        ))}
      </View>
      <StyledModal {...modal}>
        <FormikImageDescription
          handleSubmit={(values) => {
            handleAddCustomerImage(values)
            modal.toggleOpen()
          }}
        />
      </StyledModal>
    </View>
  )
}
export const FormikImageDescription = ({
  handleSubmit
}: {
  handleSubmit: (values: ImageDescriptionType) => void | Promise<void>
}) => {
  const { user } = useAuth()
  const defaultImage: Partial<ImageDescriptionType> = {
    type: 'house',
    description: '',
    src: ''
  }

  return (
    <Formik
      initialValues={defaultImage}
      onSubmit={(values: ImageDescriptionType) => {
        values.createdAt = new Date()
        values.createdBy = user.id
        handleSubmit(values)
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
                }
              ]}
            />
            <FormikInputValue name="description" placeholder="Descripción" />
            {values?.type === 'signature' ? (
              <FormikInputSignature name="src" />
            ) : (
              <FormikInputImage name="src" />
            )}
            <Button onPress={handleSubmit} label="Guardar" />
          </View>
        )
      }}
    </Formik>
  )
}
export default FormCustomerImages
export type FormCustomerImagesProps = {
  images: CustomerType['images']
  customerId: string
}
export const FormCustomerImagesE = (props: FormCustomerImagesProps) => (
  <ErrorBoundary componentName="FormCustomerImages">
    <FormCustomerImages {...props} />
  </ErrorBoundary>
)
