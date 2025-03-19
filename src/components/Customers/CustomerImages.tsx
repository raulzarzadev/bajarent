import { View, Text, Pressable } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { gStyles } from '../../styles'
import {
  CustomerType,
  ImageDescriptionType
} from '../../state/features/costumers/customerType'
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
import { useEmployee } from '../../contexts/employeeContext'
import { useState } from 'react'
import dictionary from '../../dictionary'
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

  const handleUpdateImages = async (values: ImageDescriptionType) => {
    update(customerId, {
      [`images.${values.id}`]: values
    })
  }
  const customerImages = Object.entries(images || customerPropImages || {})
    .reduce((acc, [id, image]) => {
      if (!image?.deletedAt) acc.push({ ...image, id })
      return acc
    }, [])
    .sort(
      (a, b) =>
        asDate(b?.createdAt)?.getTime() - asDate(a?.createdAt)?.getTime()
    )
  const canDeleteImages = permissions?.orders?.canDelete || permissions?.isAdmin

  if (customerImages.length === 0)
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text style={[gStyles.helper, gStyles.tCenter]}>No hay imagenes</Text>
        {showAddButton && (
          <ModalEditImages
            handleUpdate={async (values) => {
              await update(customerId, { [`images.${values?.id}`]: values })
            }}
          />
        )}
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
            handleUpdate={(image) => {
              update(customerId, { [`images.${createUUID()}`]: image })
            }}
          />
        )}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {customerImages?.map((image) => (
          <View key={image.id} style={{ margin: 4 }}>
            <ImagePreview
              onDelete={
                canDeleteImages ? () => handleDeleteImage(image.id) : undefined
              }
              image={image.src}
              height={100}
              width={100}
              title={dictionary(image.type)}
              description={image.description}
              formValues={image}
              handleSubmitForm={async (values) => {
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
            <Button
              onPress={handleSubmit}
              label="Guardar"
              disabled={disabled}
            />
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
