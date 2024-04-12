import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ModalSendWhatsapp from '../ModalSendWhatsapp'
import { useStore } from '../../contexts/storeContext'
import dictionary from '../../dictionary'
import asDate, { dateFormat } from '../../libs/utils-date'
import OrderType, { order_type } from '../../types/OrderType'
const orderPeriod = (order: Partial<OrderType>): string => {
  const res = ''
  //* if is rent should return the period
  if (order.type === order_type.RENT || order.type === order_type.STORE_RENT) {
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
  if (order.payments.length > 0) {
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
const ModalWhatsAppOrderStatus = ({ orderId }) => {
  const { orders, store } = useStore()
  const order = orders.find((o) => o.id === orderId)
  const orderStatusMessage = `
Tienda: *${store.name}*
Order: *${order.folio}*
Tipo: ${dictionary(order.type)}
Status: ${dictionary(order.status)}
Reportes activos: ${order.hasNotSolvedReports ? '*Si*' : 'No'}
${orderPeriod(order)}
${orderPayments({ order })}
 `

  return (
    <View>
      <ModalSendWhatsapp message={orderStatusMessage} to={order.phone} />
    </View>
  )
}

export default ModalWhatsAppOrderStatus

const styles = StyleSheet.create({})
