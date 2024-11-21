import React from 'react'
import Button from '../Button'
import asDate, { dateFormat } from '../../libs/utils-date'
import { useOrderDetails } from '../../contexts/orderContext'

const ButtonCopyRow = ({ orderId }: { orderId: string }) => {
  const [disabled, setDisabled] = React.useState(false)
  const { order } = useOrderDetails()
  return (
    <Button
      disabled={disabled}
      onPress={async () => {
        setDisabled(true)
        if (orderId) {
          const {
            note = '',
            fullName = '',
            phone = '',
            neighborhood = '',
            address = '',
            references = '',
            // number = '',
            deliveredAt = ''
          } = order

          const date = dateFormat(asDate(deliveredAt), 'dd/MM/yyyy')

          const serialNumber = '' //<--This should be an empty string
          const string = `${note}\t${fullName}\t${phone}\t${neighborhood}\t${address}\t${references}\t${serialNumber}\t${date}`
          navigator.clipboard.writeText(string)
          setTimeout(() => {
            setDisabled(false)
          }, 2000) //<-- disable button for 2 seconds
        }
      }}
      size="small"
      label="Copiar fila"
      icon="copy"
      variant="outline"
    />
  )
}

export default ButtonCopyRow
