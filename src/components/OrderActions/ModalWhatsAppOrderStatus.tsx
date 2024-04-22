import { StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import ModalSendWhatsapp from '../ModalSendWhatsapp'
import dictionary from '../../dictionary'
import asDate, { dateFormat } from '../../libs/utils-date'
import OrderType, { order_type } from '../../types/OrderType'
import { getFullOrderData } from '../../contexts/libs/getFullOrderData'
import { useAuth } from '../../contexts/authContext'
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
const ModalWhatsAppOrderStatus = ({ orderId }) => {
  const { store } = useAuth()
  const [order, setOrder] = useState<OrderType>()

  useEffect(() => {
    getFullOrderData(orderId).then((order) => {
      setOrder(order)
    })
  }, [])

  if (!order) return null
  const orderStatusMessage = `
Tienda: *${store?.name}*
Order: *${order?.folio}*
Tipo: ${dictionary(order?.type)}
Status: ${dictionary(order?.status)}
Reportes activos: ${order?.hasNotSolvedReports ? '*Si*' : 'No'}
${orderPeriod(order)}
${orderPayments({ order })}
 `

  return <ModalSendWhatsapp message={orderStatusMessage} to={order.phone} />
}

export default ModalWhatsAppOrderStatus

const styles = StyleSheet.create({})
