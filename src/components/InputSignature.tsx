import React, { useEffect, useRef } from 'react'
import { View, StyleSheet } from 'react-native'
import SignatureScreen from 'react-signature-canvas'
import Button from './Button'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'

const InputSignature = ({
  setValue,
  value,
  disabled
}: {
  setValue: (signature: string) => void
  value: string
  disabled?: boolean
}) => {
  const ref = useRef<SignatureScreen>(null)

  const handleClear = () => {
    ref.current.clear()
  }

  const handleConfirm = () => {
    const res = ref.current.toDataURL()
    setValue?.(res)
    modal.toggleOpen()
  }

  const modal = useModal({ title: 'Firma' })

  return (
    <View>
      <Button
        onPress={modal.toggleOpen}
        label="Firmar"
        icon="signature"
        size="small"
        disabled={disabled}
      ></Button>
      <StyledModal {...modal}>
        <View
          style={{
            borderWidth: 3,
            borderColor: 'lightgrey',
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5
          }}
        >
          <SignatureScreen ref={ref} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: 8
          }}
        >
          <Button
            label="Borrar"
            onPress={handleClear}
            variant="ghost"
            size="small"
          />
          <Button
            label="Guardar"
            onPress={handleConfirm}
            icon="save"
            size="small"
          />
        </View>
      </StyledModal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default InputSignature
