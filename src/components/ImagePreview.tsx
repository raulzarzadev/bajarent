import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import Icon, { IconName } from './Icon'
import ButtonConfirm from './ButtonConfirm'
import { ImageDescriptionType } from '../state/features/costumers/customerType'
const { height: deviceHeight } = Dimensions.get('window')

const ImagePreview = ({
  image,
  title = 'Imagen',
  width = 150,
  height = 150,
  justIcon = false,
  icon,
  onDelete,
  description,
  ComponentForm,
  formValues,
  handleSubmitForm
}: {
  image: string
  title?: string
  width?: number | `${number}%`
  height?: number
  fullscreen?: boolean
  icon?: IconName
  justIcon?: boolean
  description?: string
  formValues?: ImageDescriptionType
  handleSubmitForm?: (values: ImageDescriptionType) => Promise<void> | void
  ComponentForm?: React.FC<{
    handleSubmit: (values: ImageDescriptionType) => void | Promise<void>
    values?: ImageDescriptionType
  }>
  onDelete?: () => void | Promise<void>
}) => {
  //TODO: add button edit
  const modal = useModal({ title: title })
  //if (!image) return <></>
  return (
    <View style={{ width, height }}>
      {!!onDelete && (
        <View style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
          <ButtonConfirm
            justIcon
            openLabel="Eliminar"
            openColor="error"
            openSize="xs"
            openVariant="ghost"
            icon="delete"
            handleConfirm={async () => {
              await onDelete()
            }}
            confirmColor="error"
            confirmLabel="Eliminar"
            confirmIcon="delete"
            modalTitle="Eliminar Imagen"
          >
            <Text style={{ textAlign: 'center', marginVertical: 8 }}>
              Se eliminara esta imagen de forma permanente
            </Text>
            <Image
              source={{ uri: image }}
              width={100}
              height={100}
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                marginVertical: 2,
                minWidth: '100%',
                minHeight: 100,
                resizeMode: 'contain',
                alignItems: 'center'
              }}
            />
          </ButtonConfirm>
        </View>
      )}
      <Pressable
        onPress={modal.toggleOpen}
        style={{
          width,
          height,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          borderRadius: 4
        }}
      >
        {justIcon ? (
          <Icon icon={icon} size={30} />
        ) : (
          <Image
            source={{ uri: image }}
            style={{
              //backgroundColor: colors.lightGray,
              shadowColor: '#000',
              width,
              height,
              flex: 1,
              minHeight: height,
              marginVertical: 2,
              resizeMode: 'cover'
            }}
          />
        )}
      </Pressable>
      <StyledModal {...modal}>
        {!!onDelete && (
          <ButtonConfirm
            openLabel="Eliminar"
            openColor="error"
            openSize="xs"
            openVariant="ghost"
            icon="delete"
            handleConfirm={async () => {
              await onDelete()
              modal.toggleOpen()
            }}
            confirmColor="error"
            confirmLabel="Eliminar"
            confirmIcon="delete"
          >
            <Text style={{ textAlign: 'center', marginVertical: 8 }}>
              Se eliminara esta imagen de forma permanente
            </Text>
          </ButtonConfirm>
        )}
        {!!ComponentForm ? (
          <ComponentForm
            handleSubmit={async (values) => {
              const res = await handleSubmitForm(values)
              modal.toggleOpen()
              return res
            }}
            values={formValues}
          />
        ) : (
          <>
            {!!description && <Text>{description} </Text>}
            <Image
              source={{ uri: image }}
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                marginVertical: 2,
                minWidth: '100%',
                minHeight: deviceHeight - 100,
                resizeMode: 'contain',
                alignItems: 'center'
              }}
            />
          </>
        )}
      </StyledModal>
    </View>
  )
}

export default ImagePreview

const styles = StyleSheet.create({})
