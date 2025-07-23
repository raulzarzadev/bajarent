import { ScrollView, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import { useStore } from '../contexts/storeContext'
import { useOrdersCtx } from '../contexts/ordersContext'
import { ServicePayments } from '../firebase/ServicePayments'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import InputRadios from './InputRadios'
import Button from './Button'
import { gStyles } from '../styles'
import ListPayments from './ListPayments'

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
      ServicePayments.list(preList).then((res) => setPayments(res))
    } else {
      ServicePayments.getLast(storeId, { days: days }).then((res) =>
        setPayments(res)
      )
    }
  }

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
      <ListPayments payments={payments} />
    </ScrollView>
  )
}
