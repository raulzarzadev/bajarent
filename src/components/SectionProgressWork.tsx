import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import ListOrders from './ListOrders'
import { ProgressWork } from './ModalCurrentWork'
import OrderType from '../types/OrderType'
import { calculateProgress } from '../libs/currentWork'
import { gStyles } from '../styles'

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
  const sectionProgress = calculateProgress(
    delivered.length + resolved.length + reportedSolved.length,
    authorized.length + expired.length + reported.length
  )
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap',
          marginVertical: 16
        }}
      >
        <ModalOrdersListOfProgressWork
          label={`Entregadas`}
          modalTitle="Pedidos entregados"
          pendingOrders={authorized}
          doneOrders={delivered}
          onPressRow={onPressOrderRow}
        />

        <ModalOrdersListOfProgressWork
          label={'Renovadas'}
          modalTitle={'Renovadas / Recogidas'}
          pendingOrders={expired}
          doneOrders={resolved}
          onPressRow={onPressOrderRow}
        />
        <ModalOrdersListOfProgressWork
          label={'Reportes'}
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
  label: string
  pendingOrders?: any[]
  doneOrders?: any[]
  modalTitle?: string
  onPressRow?: () => void
}) => {
  const modal = useModal({ title: modalTitle || label })
  const underLabel = `${doneOrders.length}/${
    doneOrders.length + pendingOrders.length
  }`
  const progress = calculateProgress(doneOrders.length, pendingOrders.length)
  return (
    <View style={{ marginVertical: 6 }}>
      <Pressable onPress={modal.toggleOpen}>
        <ProgressWork
          progress={progress}
          label={label}
          underLabel={underLabel}
        />
      </Pressable>
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

const styles = StyleSheet.create({})