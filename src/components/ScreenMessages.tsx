import { View, Text } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
import InputRadios from './InputRadios'
import { gStyles } from '../styles'
import { useState } from 'react'
import ButtonConfirm from './ButtonConfirm'
import { useOrdersCtx } from '../contexts/ordersContext'
import { order_status, order_type } from '../types/OrderType'
type MessageTarget =
  | 'expired'
  | 'soon_expire'
  | 'finished'
  | 'soon_and_expired'
  | ''
export default function ScreenMessages() {
  const [value, setValue] = useState<'expire'>('expire')
  const [target, setTarget] = useState<MessageTarget>('')
  const { orders = [] } = useOrdersCtx()
  const [selectedOrders, setSelectedOrders] = useState<any[]>([])
  console.log({ selectedOrders })
  const handleSelectOrder = (target: MessageTarget) => {
    if (target === 'soon_and_expired') {
      setSelectedOrders(
        orders?.filter(
          (order) =>
            order.expiresTomorrow ||
            order.expiresOnMonday ||
            (order.status === order_status.DELIVERED && order.isExpired)
        )
      )
    }

    if (target === 'expired') {
      setSelectedOrders(
        orders?.filter(
          (order) => order.status === order_status.DELIVERED && order.isExpired
        )
      )
    }
    if (target === 'soon_expire') {
      setSelectedOrders(
        orders?.filter(
          (order) => order.expiresTomorrow || order.expiresOnMonday
        )
      )
    }
    if (target === 'finished') {
      setSelectedOrders(
        orders?.filter(
          (order) =>
            (order.status === order_status.PICKED_UP &&
              order.type === order_type.RENT) ||
            (order.status === order_status.DELIVERED &&
              order.type === order_type.REPAIR)
        )
      )
    }
  }

  return (
    <View>
      <Text style={gStyles.h2}>Mensaje</Text>
      <InputRadios
        layout="row"
        value={value}
        setValue={(val) => setValue(val)}
        options={[{ label: 'Vencimiento', value: 'expire' }]}
      />
      <Text style={gStyles.h2}>Ordenes</Text>
      <InputRadios
        layout="row"
        value={target}
        setValue={(val) => {
          setTarget(val)
          handleSelectOrder(val)
        }}
        options={[
          { label: 'Vencidas', value: 'expired' },
          { label: 'Por vencer', value: 'soon_expire' },
          { label: 'Por vencer y vencidas', value: 'soon_and_expired' },
          { label: 'Finalizadas', value: 'finished' }
        ]}
      />
      <ButtonConfirm
        openLabel="Enviar"
        modalTitle="Enviar mensaje"
        handleConfirm={async () => {
          console.log('Sending message to:', selectedOrders)
        }}
      >
        <Text>{selectedOrders.length} ordenes seleccionadas</Text>
      </ButtonConfirm>
    </View>
  )
}
export type ScreenMessagesProps = {}
export const ScreenMessagesE = (props: ScreenMessagesProps) => (
  <ErrorBoundary componentName="ScreenMessages">
    <ScreenMessages {...props} />
  </ErrorBoundary>
)
