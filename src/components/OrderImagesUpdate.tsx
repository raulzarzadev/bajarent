import { Text, View } from 'react-native'
import { useEmployee } from '../contexts/employeeContext'
import asDate from '../libs/utils-date'
import { gStyles } from '../styles'
import ImagePreview from './ImagePreview'
import dictionary from '../dictionary'
import useModal from '../hooks/useModal'
import { createUUID } from '../libs/createId'
import {
  CustomerType,
  ImageDescriptionType
} from '../state/features/costumers/customerType'
import Button from './Button'
import StyledModal from './StyledModal'
import { useAuth } from '../contexts/authContext'
import { useState } from 'react'
import { Formik } from 'formik'
import FormikInputSelect from './FormikInputSelect'
import ErrorBoundary from './ErrorBoundary'
import { useOrderDetails } from '../contexts/orderContext'
import FormikInputValue from './FormikInputValue'
import FormikInputImage from './FormikInputImage'
import { ServiceOrders } from '../firebase/ServiceOrders'

const OrderImagesUpdate = (props?: OrderImagesUpdateProps) => {
  const { order } = useOrderDetails()
  const images = order?.orderImages || {}

  const { permissions } = useEmployee()

  const handleDeleteImage = async (imageId: string) => {
    //update(order.id, { [`images.${imageId}.deletedAt`]: new Date() })
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
    .sort(
      (a, b) =>
        asDate(b?.createdAt)?.getTime() - asDate(a?.createdAt)?.getTime()
    )
  const canDeleteImages = permissions?.orders?.canDelete || permissions?.isAdmin

  if (orderImages.length === 0)
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text style={[gStyles.helper, gStyles.tCenter]}>No hay imagenes</Text>
        <ModalEditImages
          handleUpdate={(values) => {
            handleUpdateImages(values)
          }}
        />
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
          handleUpdate={(values) => {
            handleUpdateImages(values)
          }}
        />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {orderImages?.map((image) => (
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

export const ModalEditImages = ({
  handleUpdate
}: {
  handleUpdate?: (values: ImageDescriptionType) => Promise<void> | void
}) => {
  const modal = useModal({ title: 'Agregar imagen' })

  return (
    <>
      <Button
        icon="add"
        onPress={modal.toggleOpen}
        variant="ghost"
        size="small"
        justIcon
      />
      <StyledModal {...modal}>
        <FormikImageDescription
          handleSubmit={async (values) => {
            await handleUpdate?.(values)

            modal.toggleOpen()
            return
          }}
        />
      </StyledModal>
    </>
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
                }
              ]}
            />
            <FormikInputValue
              name="description"
              placeholder="Descripción"
              style={{ marginVertical: 8 }}
            />

            <FormikInputImage name="src" />

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
export default OrderImagesUpdate
export type OrderImagesUpdateProps = {}
export const OrderImagesUpdateE = (props: OrderImagesUpdateProps) => (
  <ErrorBoundary componentName="OrderImagesUpdate">
    <OrderImagesUpdate {...props} />
  </ErrorBoundary>
)
