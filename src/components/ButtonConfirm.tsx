import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Button, { ButtonProps } from './Button'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import ButtonIcon, { IconButtonProps } from './ButtonIcon'

const ButtonConfirm = ({
  openLabel,
  modalTitle = 'Confirmar',
  confirmLabel = 'Aceptar',
  text = '',
  children = null,
  handleConfirm = async () => console.log('confirm'),
  justIcon,
  icon,
  openVariant,
  openColor,
  confirmVariant,
  confirmColor
}: {
  openLabel?: string
  modalTitle?: string
  confirmLabel?: string
  children?: React.ReactNode
  handleConfirm?: () => Promise<any>
  justIcon?: boolean
  icon?: IconButtonProps['icon']
  openVariant?: ButtonProps['variant']
  openColor?: ButtonProps['color']
  confirmVariant?: ButtonProps['variant']
  confirmColor?: ButtonProps['color']
  text: string
}) => {
  const modal = useModal({ title: modalTitle })
  const [sending, setSending] = React.useState(false)
  return (
    <View>
      {justIcon ? (
        <ButtonIcon
          icon={icon}
          color={openColor}
          variant={openVariant}
          onPress={modal.toggleOpen}
        ></ButtonIcon>
      ) : (
        <Button
          color={openColor}
          variant={openVariant}
          onPress={modal.toggleOpen}
        >
          {openLabel}
        </Button>
      )}
      <StyledModal {...modal}>
        {text && (
          <Text style={{ textAlign: 'center', marginVertical: 18 }}>
            {text}
          </Text>
        )}
        {children}
        <View style={styles.buttons}>
          <Button buttonStyles={{}} onPress={modal.toggleOpen}>
            Cancelar
          </Button>
          <Button
            buttonStyles={{}}
            color={confirmColor}
            variant={confirmVariant}
            disabled={sending}
            onPress={async () => {
              setSending(true)
              await handleConfirm()
                .then((r) => console.log(r))
                .catch((e) => console.error(e))
                .finally(() => {
                  setSending(false)
                  modal.toggleOpen()
                })
            }}
          >
            {confirmLabel}
          </Button>
        </View>
      </StyledModal>
    </View>
  )
}

export default ButtonConfirm

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  }
})
