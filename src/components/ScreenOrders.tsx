import { useStore } from '../contexts/storeContext'
import ListOrders from './ListOrders'
import { useOrdersCtx } from '../contexts/ordersContext'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import { Text } from 'react-native'
import { gStyles } from '../styles'
import InputSelect from './InputSelect'
import useOrders from '../hooks/useOrders'

function ScreenOrders({ route, navigation: { navigate } }) {
  useStore() //*<---- FIXME: if you remove this everything will break

  const hasOrderList = !!route?.params?.orders
  const { orders, fetchTypeOrders, setFetchTypeOrders, orderTypeOptions } =
    useOrdersCtx()
  const { orders: preOrders } = useOrders({ ids: route?.params?.orders })

  const modal = useModal({
    title: 'Tipo de ordenes'
  })

  return (
    <>
      <StyledModal {...modal}>
        <Text style={gStyles.h3}>
          Selecciona que tipo de ordenes quieres ver
        </Text>
        <InputSelect
          options={orderTypeOptions}
          value={fetchTypeOrders}
          onChangeValue={setFetchTypeOrders}
        />
      </StyledModal>

      <ListOrders
        orders={hasOrderList ? preOrders : orders}
        //defaultOrdersIds={filtered}

        sideButtons={[
          {
            icon: 'download',
            label: '',
            onPress: modal.toggleOpen,
            //* If hasOrderList hide button to choose type of orders
            visible: !hasOrderList
          },
          {
            icon: 'add',
            label: '',
            onPress: () => {
              // @ts-ignore
              navigate('NewOrder')
            },
            visible: true
          }
        ]}
      />
    </>
  )
}

export default ScreenOrders
