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

export default function ModalSendWhatsapp({ orderId = '' }) {
  const modal = useModal({ title: 'Enviar mensaje' })
  const [order, setOrder] = useState<OrderType>()
  const phone = order?.phone
  const invalidPhone = !phone || phone?.length < 10

  const [message, setMessage] = useState('')
  const { store } = useStore()
  const handleGetOrderInfo = () => {
    getFullOrderData(orderId).then((order) => {
      const orderStatusMessage = `
      *${store?.name}*
      Tipo: ${dictionary(order?.type)}
      Order: *${order?.folio}*
      Status: ${dictionary(order?.status)}
      ${order?.hasNotSolvedReports ? 'Reportes activos: *Si*' : 'Sin reportes'}
      ${orderPeriod(order)}
      ${orderPayments({ order })}
      `
      setMessage(orderStatusMessage)
      setOrder(order)
    })
  }
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
          disabled={invalidPhone}
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

  if (order.type === order_type.REPAIR) {
    return `
  Marca: ${order.itemBrand || ''}
  Serie: ${order.itemSerial || ''}
  Problema: ${order.description || ''}

  ${
    order.repairInfo
      ? `
  ${order.repairInfo || ''}
  $${order.repairTotal || 0}
  `
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
