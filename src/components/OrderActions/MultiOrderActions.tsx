import { Text, View } from 'react-native'
import React from 'react'
import Button from '../Button'
import { handleCancel } from './libs/order_actions'
import { useAuth } from '../../contexts/authContext'
import { useEmployee } from '../../contexts/employeeContext'
import { onDelete, onSetStatuses } from '../../libs/order-actions'
import { useOrdersCtx } from '../../contexts/ordersContext'
import { gStyles } from '../../styles'
import ButtonDeleteOrder from './ButtonDeleteOrder'

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
  const handleDeleteOrders = () => {
    setLoading(true)
    const res = ordersIds.map(async (id) => {
      return await onDelete({ orderId: id })
    })
    timeOut()
  }

  const handleUpdateStatuses = async () => {
    setLoading(true)
    const res = ordersIds.map(async (id) => {
      return await onSetStatuses({ orderId: id })
    })
    timeOut()
  }

  // const handleCreateItem = async () => {
  //   setLoading(true)
  //   const items = createItemsFromOrders(
  //     orders.filter((o) => ordersIds.includes(o.id))
  //   )
  //   console.log({ items })
  //   timeOut()
  // }
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
    <Button
      onPress={() => handleUpdateStatuses()}
      label="Actualizar"
      icon="refresh"
      variant="outline"
      color="neutral"
      disabled={loading}
    />
    // <Button
    //   onPress={() => handleCreateItem()}
    //   label="Crear item"
    //   icon="save"
    //   variant="outline"
    //   color="neutral"
    //   disabled={loading}
    // />
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

export default MultiOrderActions
