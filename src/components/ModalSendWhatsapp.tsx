import { View, Text, Linking } from 'react-native'
import React, { useState } from 'react'
import Button from './Button'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import { gStyles } from '../styles'
import theme from '../theme'
import OrderType, { order_type } from '../types/OrderType'
import dictionary from '../dictionary'
import asDate, { dateFormat } from '../libs/utils-date'
import { getFullOrderData } from '../contexts/libs/getFullOrderData'
import { useStore } from '../contexts/storeContext'
import InputRadios from './InputRadios'

export default function ModalSendWhatsapp({ orderId = '' }) {
  const modal = useModal({ title: 'Enviar mensaje' })
  const [order, setOrder] = useState<OrderType>()
  const phone = order?.phone
  const invalidPhone = !phone || phone?.length < 10
  const { store } = useStore()

  const messages = [
    {
      type: 'collection',
      content: `
      Estimado cliente de *${store?.name}*,
      Su RENTA vence el día de mañana. 
      Para evitar recargos, favor de enviar el comprobante de depósito, transferencia, o estar en el domicilio para que el repartidor pase por el efectivo.
      \n${store?.bankInfo
        ?.map((bank) => {
          return `*${bank.bank}*\n${bank.clabe}
        `
        })
        .join('\n')}
        \nOrden: ${order?.folio || ''}
        \nCliente: ${order?.fullName || ''}
        \n${orderPeriod(order)}
        \nPara cualquier duda o aclaración estamos a sus órdenes al \n teléfono\n${
          store?.phone
        } o al \nwhatsapp\n ${store?.mobile || ''}
      `
    },
    {
      type: 'orderStatus',
      content: `
      *${store?.name}*
      Tipo: ${dictionary(order?.type)}
      Order: *${order?.folio}*
      Status: ${dictionary(order?.status)}
      ${order?.hasNotSolvedReports ? 'Reportes activos: *Si*' : 'Sin reportes'}
      ${orderPeriod(order)}
      ${orderPayments({ order })}
      `
    }
  ]

  const handleGetOrderInfo = () => {
    getFullOrderData(orderId).then((order) => {
      setOrder(order)
      setMessage(messages.find((m) => m.type === messageType)?.content)
    })
  }
  const [messageType, setMessageType] = useState<'collection' | 'orderStatus'>()
  const [message, setMessage] = useState<string>()
  // messages.find((m) => m.type === messageType)?.content

  return (
    <View>
      <Button
        label="Whatsapp"
        onPress={() => {
          handleGetOrderInfo()
          modal.toggleOpen()
        }}
        size="small"
        icon="whatsapp"
      ></Button>
      <StyledModal {...modal}>
        <InputRadios
          options={[
            { label: 'Cobranza', value: 'collection' },
            { label: 'Status', value: 'orderStatus' }
          ]}
          value={messageType}
          setValue={(value) => {
            setMessageType(value)
            setMessage(messages.find((m) => m.type === value)?.content || '')
          }}
          layout="row"
        />
        <Text>{message}</Text>
        {invalidPhone && (
          <Text
            style={[
              gStyles.helper,
              { color: theme.error, textAlign: 'center', marginVertical: 6 }
            ]}
          >
            Numero de telefono invalido
          </Text>
        )}
        <Button
          disabled={invalidPhone || !message}
          label="Enviar"
          onPress={() => {
            Linking.openURL(
              `whatsapp://send?text=${encodeURIComponent(
                message
              )}&phone=${phone}`
            )
          }}
        ></Button>
      </StyledModal>
    </View>
  )
}

const orderPeriod = (order: Partial<OrderType>): string => {
  const res = ''
  //* if is rent should return the period
  if (
    order?.type === order_type.RENT ||
    order?.type === order_type.STORE_RENT
  ) {
    return `Periodo:  ${dateFormat(
      asDate(order.deliveredAt),
      'dd/MM/yy'
    )} al ${dateFormat(asDate(order.expireAt), 'dd/MM/yy')}`
  }

  if (order?.type === order_type.REPAIR) {
    return `Marca: ${order?.itemBrand || ''}\nSerie: ${
      order?.itemSerial || ''
    }\nProblema: ${order?.description || ''}
  \n${
    order?.repairInfo
      ? `\n${order?.repairInfo || ''}
      \n$${order?.repairTotal || 0}`
      : ''
  }`
  }
  return res
}
const orderPayments = ({ order }: { order: OrderType }) => {
  let res = ''
  if (order?.payments?.length > 0) {
    res += `
  *Pagos:* \n`
    order.payments.forEach((p) => {
      res += `${new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
      }).format(p.amount)} ${dictionary(p.method)} ${dateFormat(
        asDate(p.createdAt),
        'dd/MMM/yy HH:mm'
      )} \n`
    })
  }
  return res
}
