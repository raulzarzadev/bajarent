import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Button, { ButtonProps } from './Button'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import ButtonIcon, { IconButtonProps } from './ButtonIcon'
import { gStyles } from '../styles'

const ButtonConfirm = ({
  openLabel,
  modalTitle = 'Confirmar',
  confirmLabel = 'Aceptar',
  text = '',
  openFullWidth,
  children = null,
  handleConfirm = async () => console.log('confirm'),
  justIcon,
  icon,
  openVariant,
  openColor,
  confirmVariant,
  confirmColor,
  openSize,
  openDisabled,
  confirmDisabled,
  hideConfirm,
  confirmIcon,
  onOpen,
  confirmDisabledHelper,
  cancelButton = false,
  handleCancel,
  progress,
  openStyles,
  cancelLabel
}: {
  openFullWidth?: boolean
  progress?: ButtonProps['progress']
  confirmIcon?: IconButtonProps['icon']
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
  confirmDisabled?: boolean
  text?: string
  openSize?: ButtonProps['size']
  openDisabled?: ButtonProps['disabled']
  onOpen?: () => void
  confirmDisabledHelper?: string
  /**
   * @deprecated
   */
  cancelButton?: boolean
  hideConfirm?: boolean
  cancelLabel?: string
  handleCancel?: () => void
  openStyles?: ButtonProps['buttonStyles']
}) => {
  const modal = useModal({ title: modalTitle })
  const [sending, setSending] = React.useState(false)
  return (
    <View>
      {justIcon ? (
        <ButtonIcon
          buttonStyles={openStyles}
          icon={icon}
          color={openColor}
          variant={openVariant}
          onPress={() => {
            if (onOpen) onOpen()
            modal.toggleOpen()
          }}
          size={openSize}
          disabled={openDisabled}
        ></ButtonIcon>
      ) : (
        <Button
          buttonStyles={openStyles}
          color={openColor}
          variant={openVariant}
          onPress={() => {
            if (onOpen) onOpen()
            modal.toggleOpen()
          }}
          label={openLabel}
          icon={icon}
          size={openSize}
          disabled={openDisabled}
          progress={progress}
          fullWidth={openFullWidth}
        ></Button>
      )}
      <StyledModal {...modal}>
        {!!text && (
          <Text style={{ textAlign: 'center', marginVertical: 18 }}>
            {text}
          </Text>
        )}
        {children}
        {confirmDisabled && confirmDisabledHelper && (
          <Text style={[gStyles.helperError, { textAlign: 'center' }]}>
            *{confirmDisabledHelper}
          </Text>
        )}
        <View style={styles.buttons}>
          {(!!handleCancel || cancelButton) && (
            <Button
              variant="ghost"
              onPress={() => {
                modal.toggleOpen()
                handleCancel()
              }}
              label={cancelLabel || 'Cancelar'}
            ></Button>
          )}
          {!hideConfirm && (
            <Button
              id={'confirmButton'}
              buttonStyles={{}}
              color={confirmColor}
              icon={confirmIcon || icon}
              variant={confirmVariant}
              disabled={sending || confirmDisabled}
              onPress={async () => {
                setSending(true)
                await handleConfirm()
                  .then((r) => {
                    //console.log({r})
                  })
                  .catch((e) => console.error(e))
                  .finally(() => {
                    setSending(false)
                    modal.toggleOpen()
                  })
              }}
              label={confirmLabel}
            ></Button>
          )}
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
