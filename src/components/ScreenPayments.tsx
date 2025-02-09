import { ScrollView, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import { useStore } from '../contexts/storeContext'
import { useOrdersCtx } from '../contexts/ordersContext'
import { ServicePayments } from '../firebase/ServicePayments'
import { ConsolidatedStoreOrdersType } from '../firebase/ServiceConsolidatedOrders'
import PaymentType from '../types/PaymentType'
import { ListE } from './List'
import PaymentRow from './PaymentRow'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import InputRadios from './InputRadios'
import Button from './Button'
import { gStyles } from '../styles'
import { onInvalidatePayment, onVerifyPayment } from '../libs/payments'
import ButtonConfirm from './ButtonConfirm'

export default function ScreenPayments({ navigation, route }) {
  const preList = route?.params?.payments || null
  const { consolidatedOrders } = useOrdersCtx()
  const { storeId } = useStore()
  const [days, setDays] = useState(1)
  const [payments, setPayments] = useState([])

  useEffect(() => {
    handleGetPayments()
  }, [consolidatedOrders])
  const handleGetPayments = () => {
    if (preList?.length) {
      ServicePayments.list(preList).then((res) =>
        setPayments(
          formatPaymentWithOrder({
            payments: res,
            orders: consolidatedOrders?.orders
          })
        )
      )
    } else {
      ServicePayments.getLast(storeId, { days: days }).then((res) =>
        setPayments(
          formatPaymentWithOrder({
            payments: res,
            orders: consolidatedOrders?.orders
          })
        )
      )
    }
  }
  const sortFields = [
    { key: 'orderFolio', label: 'Folio' },
    { key: 'createdAt', label: 'Fecha' },
    { key: 'amount', label: 'Cantidad' },
    { key: 'method', label: 'Método' },
    { key: 'reference', label: 'Referencia' },
    { key: 'createdByName', label: 'Creado por' }
  ]
  const { staff } = useStore()
  const modalDays = useModal({
    title: `Consultar ${days >= 365 ? 'un año atras' : `${days} días atras`}`
  })
  return (
    <ScrollView>
      <StyledModal {...modalDays}>
        <View>
          <InputRadios
            layout="row"
            value={days.toString()}
            options={[
              {
                label: 'Hoy',
                value: '1'
              },
              { label: '5 dias', value: '5' },
              { label: '15 días', value: '15' },
              { label: '30 días', value: '30' },
              { label: '1 año', value: '365' }
            ]}
            label="Mostrar pagos registrados desde hace"
            setValue={(value) => {
              setDays(parseInt(value))
            }}
          />
          <Button
            label="Buscar"
            onPress={() => {
              handleGetPayments()
              modalDays.toggleOpen()
            }}
          ></Button>
        </View>
      </StyledModal>
      <Text style={gStyles.h2}>Pagos de los últimos {days} días</Text>
      <ListE
        ComponentMultiActions={({ ids }) => {
          return (
            <ModalVerifyPayments
              ids={ids}
              fetchPayments={() => {
                handleGetPayments()
              }}
            />
          )
        }}
        data={payments.map((payment) => {
          payment.amount = parseFloat(`${payment.amount || 0}`) || 0
          payment.createdByName =
            staff.find((s) => s.userId === payment.createdBy)?.name ||
            'sin nombre'
          return payment
        })}
        ComponentRow={({ item }) => (
          <PaymentRow
            item={item}
            onVerified={() => {
              handleGetPayments()
            }}
          />
        )}
        sortFields={sortFields}
        defaultSortBy="createdAt"
        defaultOrder="des"
        onPressRow={(paymentId) => {
          navigation.navigate('ScreenPaymentsDetails', { id: paymentId })
        }}
        sideButtons={[
          {
            icon: 'refresh',
            label: 'Recargar',
            onPress: handleGetPayments,
            visible: true
          },
          {
            icon: 'calendar',
            label: 'dias',
            visible: true,
            onPress: modalDays.toggleOpen
          }
        ]}
        filters={[
          // {
          //   field: 'date',
          //   label: 'Fecha'
          // },
          {
            field: 'createdByName',
            label: 'Creado por'
          },
          {
            field: 'method',
            label: 'Método'
          }
          // {
          //   field: 'createdAt',
          //   label: 'Creado',
          //   isDate: true
          // }
        ]}
      />
    </ScrollView>
  )
}

export const ModalVerifyPayments = ({
  ids,
  fetchPayments
}: {
  ids: string[]
  fetchPayments: () => void
}) => {
  const { storeId } = useStore()
  const handleVerifyPayments = async (ids: string[]) => {
    const validationsPromises = ids.map((id) => {
      return onVerifyPayment(id, storeId).then(() => {})
    })

    return await Promise.all(validationsPromises)
      .then((res) => {
        console.log({ res })
      })
      .catch(console.error)
      .finally(() => {
        fetchPayments()
      })
  }
  const handleInvalidatePayments = async (ids: string[]) => {
    const invalidation = ids.map((id) => {
      return onInvalidatePayment(id, storeId).then(() => {})
    })

    return await Promise.all(invalidation)
      .then((res) => {
        console.log({ res })
      })
      .catch(console.error)
      .finally(() => {
        fetchPayments()
      })
  }

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
      <ButtonConfirm
        handleConfirm={async () => {
          await handleVerifyPayments(ids)
        }}
        confirmLabel="Verificar"
        confirmColor="success"
        confirmVariant="filled"
        text="¿Verificar pagos?"
        openLabel="Verificar pagos"
        openColor="success"
        openVariant="filled"
        openSize="xs"
      />
      <ButtonConfirm
        handleConfirm={async () => {
          await handleInvalidatePayments(ids)
        }}
        confirmLabel="Invalidar"
        confirmColor="error"
        confirmVariant="ghost"
        text="Invalidar pagos?"
        openLabel="Invalidar pagos"
        openColor="error"
        openVariant="ghost"
        openSize="xs"
      />
    </View>
  )
}

export const formatPaymentWithOrder = ({
  payments,
  orders
}: {
  payments: PaymentType[]
  orders: ConsolidatedStoreOrdersType['orders']
}): (PaymentType & {
  orderFolio: number
  orderName: string
  orderNote: string
})[] => {
  const paymentWithOrderData = payments?.map((p) => {
    const consolidateOrder = orders?.[p?.orderId]
    return {
      ...p,
      orderFolio: consolidateOrder?.folio ?? 0, // Usar ?? para proporcionar un valor predeterminado
      orderName: consolidateOrder?.fullName ?? '', // Usar ?? para proporcionar un valor predeterminado
      orderNote: consolidateOrder?.note ?? '' // Usar ?? para proporcionar un valor predeterminado
    }
  })
  return paymentWithOrderData
}
