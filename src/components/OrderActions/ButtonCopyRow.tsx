import React from 'react'
import Button from '../Button'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import asDate, { dateFormat } from '../../libs/utils-date'
import OrderType from '../../types/OrderType'

const ButtonCopyRow = ({ orderId }: { orderId: string }) => {
  const [disabled, setDisabled] = React.useState(false)

  return (
    <Button
      disabled={disabled}
      onPress={async () => {
        setDisabled(true)
        if (orderId) {
          const order: Partial<OrderType> = await ServiceOrders.get(orderId)
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
    />
  )
}

export default ButtonCopyRow
