import { View } from 'react-native'
import useModal from '../hooks/useModal'
import type OrderType from '../types/OrderType'
import type { IconName } from './Icon'
import ListOrders from './ListOrders'
import StyledModal from './StyledModal'

const SectionProgressWork = ({
  authorized,
  delivered,
  expired,
  resolved,
  reported,
  reportedSolved,
  onPressOrderRow
}: {
  authorized: Partial<OrderType>[]
  delivered: Partial<OrderType>[]
  expired: Partial<OrderType>[]
  resolved: Partial<OrderType>[]
  reported: Partial<OrderType>[]
  reportedSolved: Partial<OrderType>[]
  onPressOrderRow: () => void
}) => {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap'
          // marginVertical: 16
        }}
      >
        <ModalOrdersListOfProgressWork
          label={`Entregadas`}
          // icon={'home'}
          modalTitle="Pedidos entregados"
          pendingOrders={authorized}
          doneOrders={delivered}
          onPressRow={onPressOrderRow}
        />

        <ModalOrdersListOfProgressWork
          label={'Vencidas'}
          // icon={'alarm'}
          modalTitle={'Renovadas / Recogidas'}
          pendingOrders={expired}
          doneOrders={resolved}
          onPressRow={onPressOrderRow}
        />
        <ModalOrdersListOfProgressWork
          label={'Reportes'}
          //  icon={'report'}
          modalTitle="Reportes resueltos"
          pendingOrders={reported}
          doneOrders={reportedSolved}
          onPressRow={onPressOrderRow}
        />
        <ModalOrdersListOfProgressWork
          label={'Total'}
          modalTitle="Total"
          pendingOrders={[...authorized, ...expired, ...reported]}
          doneOrders={[...delivered, ...resolved, ...reportedSolved]}
          onPressRow={onPressOrderRow}
        />
      </View>
    </View>
  )
}

const ModalOrdersListOfProgressWork = ({
  // progress,
  label,
  pendingOrders = [],
  doneOrders = [],
  modalTitle = '',
  onPressRow
}: {
  //progress: number
  label?: string
  pendingOrders?: any[]
  doneOrders?: any[]
  modalTitle?: string
  onPressRow?: () => void
  icon?: IconName
}) => {
  const modal = useModal({ title: modalTitle || label })

  return (
    <View style={{ marginVertical: 6 }}>
      <StyledModal {...modal}>
        <ListOrders
          orders={doneOrders}
          onPressRow={() => {
            onPressRow?.()
            modal.toggleOpen()
          }}
        />
      </StyledModal>
    </View>
  )
}

export default SectionProgressWork
