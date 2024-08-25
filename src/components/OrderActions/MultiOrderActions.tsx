import { Text, View } from 'react-native'
import React, { useEffect } from 'react'
import Button from '../Button'
import { handleCancel } from './libs/order_actions'
import { useAuth } from '../../contexts/authContext'
import { useEmployee } from '../../contexts/employeeContext'
import {
  onAssignOrder,
  onDelete,
  onSetStatuses
} from '../../libs/order-actions'
import { useOrdersCtx } from '../../contexts/ordersContext'
import { gStyles } from '../../styles'
import ButtonDeleteOrder from './ButtonDeleteOrder'
import useModal from '../../hooks/useModal'
import StyledModal from '../StyledModal'
import OrderType from '../../types/OrderType'
import { excelFormatToOrder, orderAsExcelFormat } from '../../libs/orders'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import asDate, { dateFormat } from '../../libs/utils-date'
import SpanCopy from '../SpanCopy'
import InputAssignSection from '../InputAssingSection'
import { useStore } from '../../contexts/storeContext'

const MultiOrderActions = ({
  ordersIds = [],
  data
}: {
  ordersIds: string[]
  data: any[]
}) => {
  const { storeId, user } = useAuth()
  const {
    permissions: { orders: permissionsOrder, isOwner, isAdmin }
  } = useEmployee()
  const { handleRefresh, orders } = useOrdersCtx()

  const [loading, setLoading] = React.useState(false)

  const canCancel = permissionsOrder?.canCancel || isOwner || isAdmin
  const canDelete = permissionsOrder?.canDelete || isOwner || isAdmin

  const timeOut = () => {
    setTimeout(() => {
      setLoading(false)
      handleRefresh()
    }, 3000)
  }

  const handleCancelOrders = () => {
    setLoading(true)
    const res = ordersIds.map((id) =>
      handleCancel({ orderId: id, storeId, userId: user.id || '' })
    )
    timeOut()
  }

  const buttons = [
    canCancel && (
      <Button
        onPress={() => handleCancelOrders()}
        label="Cancelar"
        icon="cancel"
        variant="outline"
        color="neutral"
        disabled={loading}
      />
    ),
    canDelete && <ButtonDeleteOrder orderIds={ordersIds} />,

    <ModalAssignOrders ordersIds={ordersIds} />
  ]
  return (
    <View style={{ marginTop: 8 }}>
      <Text style={gStyles.h3}>
        {ordersIds?.length || 0} de {data?.length}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-around',
          padding: 2,
          flexWrap: 'wrap'
        }}
      >
        {buttons.map(
          (button, i) =>
            button && (
              <View key={i} style={{ padding: 4, width: '50%' }}>
                {button}
              </View>
            )
        )}
        {/* To fix las element */}
        <View style={{ flex: 1 }} />
      </View>
    </View>
  )
}

const ModalAssignOrders = ({ ordersIds }: { ordersIds: string[] }) => {
  const { storeId } = useStore()
  const handleAssignOrders = async ({ sectionId, sectionName, ordersIds }) => {
    try {
      const promises = ordersIds.map((orderId) =>
        onAssignOrder({ orderId, sectionId, sectionName, storeId })
      )
      return await Promise.all(promises)
    } catch (e) {
      console.error({ e })
    }
  }
  return (
    <View>
      <InputAssignSection
        currentSection={null}
        setNewSection={async ({ sectionId, sectionName }) => {
          await handleAssignOrders({ sectionId, sectionName, ordersIds })
        }}
        disabled={false}
      />
    </View>
  )
}

const ModalExcelRows = ({ ordersIds }: { ordersIds: OrderType['id'][] }) => {
  const modal = useModal({ title: 'Formato excel' })
  const [orders, setOrders] = React.useState<OrderType[]>([])

  useEffect(() => {
    ServiceOrders.getList(ordersIds).then((res) => {
      setOrders(res)
    })
  }, [ordersIds])

  return (
    <View>
      <Button
        onPress={modal.toggleOpen}
        label="Formato excel"
        icon="list"
        variant="outline"
        color="neutral"
      ></Button>
      <StyledModal {...modal}>
        {ordersIds.map((id) => {
          const order = orders.find((o) => o.id === id)
          const excelRow = orderAsExcelFormat(order)
          const {
            note,
            fullName,
            phone,
            neighborhood,
            address,
            references,
            scheduledAt
          } = excelFormatToOrder(excelRow)
          return (
            <Text
              key={id}
              style={[
                { marginBottom: 6, flexDirection: 'row' },
                gStyles.helper
              ]}
              numberOfLines={1}
            >
              <Text style={{ width: 60 }}>{note}</Text>
              <Text style={{ width: 60 }}>{fullName}</Text>
              <Text style={{ width: 60 }}>{phone}</Text>
              <Text style={{ width: 60 }}>{neighborhood}</Text>
              <Text style={{ width: 60 }}>{address}</Text>
              <Text style={{ width: 60 }}>{references}</Text>
              <Text style={{ width: 60 }}>
                {dateFormat(asDate(scheduledAt), 'dd/MM/yyyy')}
              </Text>
            </Text>
          )
        })}

        <Text>
          Copia y pega en tu hoja de cálculo favorita. Asegúrate de que los
          campos estén en el mismo orden.
        </Text>
        <SpanCopy
          copyValue={ordersIds
            .map((id) => orderAsExcelFormat(orders.find((o) => o.id === id)))
            .join('')}
          label={'Copia'}
        />
      </StyledModal>
    </View>
  )
}

export default MultiOrderActions
