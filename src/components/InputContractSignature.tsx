import { View } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
import ButtonConfirm from './ButtonConfirm'
import InputSignature from './InputSignature'
import InputCheckbox from './Inputs/InputCheckbox'
import { useState } from 'react'
const InputContractSignature = (props?: InputContractSignatureProps) => {
  const [accept, setAccept] = useState(props?.values?.accept || false)
  const [sendCopy, setSendCopy] = useState(props?.values?.sendCopy || false)
  const [signature, setSignature] = useState(props?.values?.signature || '')

  const handleSetValues = async () => {
    props?.setValues({ accept, sendCopy, signature })
  }
  const isSigned = !!signature

  return (
    <View>
      <ButtonConfirm
        modalTitle="Firma de contrato"
        icon="contract"
        openSize="xs"
        openLabel={isSigned ? 'Contrato firmado' : 'Firmar contrato'}
        openStyles={{ margin: 'auto' }}
        handleConfirm={async () => {
          handleSetValues()
        }}
        handleCancel={async () => {
          setAccept(false)
        }}
        openColor={isSigned ? 'success' : 'primary'}
        confirmDisabled={!accept || !signature}
      >
        <View>
          <ButtonConfirm
            modalTitle="Terminos del contrato"
            icon="contract"
            openVariant="ghost"
            openSize="xs"
            openLabel="Leer contrato"
            openStyles={{ margin: 'auto' }}
            handleConfirm={async () => {
              setAccept(true)
            }}
            handleCancel={async () => {
              setAccept(false)
            }}
            openColor="primary"
          ></ButtonConfirm>
        </View>
        <View style={{ marginVertical: 8 }}>
          <InputSignature setValue={setSignature} value={signature} />
        </View>
        <View style={{ marginVertical: 8 }}>
          <InputCheckbox
            value={accept}
            setValue={setAccept}
            label="Acepto los terminos del contrato"
          ></InputCheckbox>
        </View>
        <InputCheckbox
          value={sendCopy}
          setValue={setSendCopy}
          label="Enviar copia a mi correo"
        ></InputCheckbox>
      </ButtonConfirm>
    </View>
  )
}
export default InputContractSignature

export type InputContractSignatureValues = {
  accept: boolean
  sendCopy: boolean
  signature: string
}

export type InputContractSignatureProps = {
  setValues: (values: InputContractSignatureValues) => void | Promise<void>
  values: InputContractSignatureValues
}

export const InputContractSignatureE = (props: InputContractSignatureProps) => (
  <ErrorBoundary componentName="InputContractSignature">
    <InputContractSignature {...props} />
  </ErrorBoundary>
)
