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
import { translateTime } from '../libs/expireDate'
export default function ModalSendWhatsapp({ orderId = '' }) {
  const modal = useModal({ title: 'Enviar mensaje' })
  const [order, setOrder] = useState<OrderType>()
  const phone = order?.phone
  const invalidPhone = !phone || phone?.length < 10
  const { store } = useStore()
  const upcomingExpire = `Estimado ${order?.fullName} cliente de ${store?.name}

  Su contrato ${
    order?.folio
  } 📄 de RENTA de lavadora  vence el día de mañana 😔. 
  
  Para renovarlo 😊 favor de transferir 💸  únicamente a cualquiera de las siguientes 3 cuentas a nombre de ${
    store?.name
  } y/o Humberto Avila:
  
  ${store?.bankInfo.map(({ bank, clabe }) => {
    return `🏦 ${bank} ${clabe}`
  })}
  🏦 SPIN/OXXO 4217470038523789 

  Enviar su comprobante al whatsapp ${store?.mobile} y esperar confirmación 👌🏼
  
  Cualquier aclaración favor de comunicarse a los teléfonos:
  📞 ${store?.phone}
  📱 ${store?.mobile} 
  
  En caso de no querer continuar con el servicio favor de avisar horario de recolección para evitar cargos 💲 por días extras. 
        
  De antemano le agradecemos su atención 🙏🏼`

  const expireToday = `Estimado ${order?.fullName} cliente de ${store?.name}

  Su contrato ${order?.folio} 📄 de RENTA de lavadora *VENCE HOY* 😔. 
  
  Para renovarlo 😊 favor de transferir 💸  únicamente a cualquiera de las siguientes  cuentas a nombre de ${
    store?.name
  } y/o Humberto Avila:
  
  ${store?.bankInfo?.map(({ bank, clabe }) => {
    return `🏦 ${bank} ${clabe}`
  })}
  🏦 SPIN/OXXO 4217470038523789 
  
  Enviar su comprobante al whatsapp ${store?.mobile} y esperar confirmación 👌🏼
  
  Cualquier aclaración favor de comunicarse a los teléfonos:
  📞 ${store?.phone}
  📱 ${store?.mobile} 
  


  En caso de no querer continuar con el servicio 😞 favor de avisar horario de recolección para evitar cargos 💲 por días extras. 
        
  De antemano le agradecemos su atención 🙏🏼`

  const payment = `Estimado ${order.fullName} cliente de ${store.name}

  Su Comprobante de RENTA de lavadora  
  📄 Contrato ${order?.folio}  
  💲 Monto pagado $${order?.items?.[0]?.priceSelected?.amount?.toFixed(2) || 0}
  🗓️ Periodo contratado ${translateTime(order?.items?.[0]?.priceSelected?.time)}
  ⏳ Vigencia de jueves 30/05/24
  🔚 Vencimiento jueves 06/06/24
  
  Cualquier aclaración y/o reporte 🛠️ favor de comunicarse a los teléfonos:
  📞 ${store?.phone}
  📱 ${store?.mobile} Whatsapp
  
  
 
  📍 ${store.address}`

  const repair = `Estimado ${order?.fullName} cliente de ${store?.name}

  Su Comprobante de REPARACION de lavadora  
  📄 Contrato ${order?.folio}
  📆 Fecha ${dateFormat(asDate(order?.deliveredAt), 'dd MMMM yyyy')}
  🛠️ Marca de aparato ${order?.itemBrand}
  #️⃣ Serie ${order?.itemSerial} 
  🧾 ${order?.description}
  💲 Monto pagado $0
  🗓️ Garantía 1 Mes
  
  
  Cualquier aclaración y/o reporte 🛠️ favor de comunicarse a los teléfonos:
  📞 ${store?.phone}
  📱 ${store?.mobile} Whatsapp
  
  📍 ${store.address}`

  const messages = [
    {
      type: 'upcomingExpire',
      content: upcomingExpire
    },
    {
      type: 'expireToday',
      content: expireToday
    },
    {
      type: 'receipt-rent',
      content: payment
    },
    {
      type: 'receipt-repair',
      content: repair
    }
  ]

  const handleGetOrderInfo = () => {
    getFullOrderData(orderId).then((order) => {
      setOrder(order)
      setMessage(messages.find((m) => m.type === messageType)?.content)
    })
  }
  const [messageType, setMessageType] = useState<
    'upcomingExpire' | 'expireToday' | 'receipt-rent' | 'receipt-repair'
  >()
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
            { label: 'Vence mañana', value: 'upcomingExpire' },
            { label: 'Vence hoy', value: 'expireToday' },
            { label: 'Compobante Renta', value: 'receipt-rent' },
            { label: 'Compobante Reparación', value: 'receipt-repair' }
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
              `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
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
