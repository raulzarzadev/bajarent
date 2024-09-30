import {
  FlexStyle,
  Pressable,
  Text,
  useWindowDimensions,
  View
} from 'react-native'
import React from 'react'
import StyledModal from './StyledModal'
import CurrencyAmount from './CurrencyAmount'
import useModal from '../hooks/useModal'
import { BalanceAmountsE } from './BalanceAmounts'
import { payments_amount } from '../libs/payments'
import { gStyles } from '../styles'
import ProgressBar from './ProgressBar'
import { useCurrentWorkCtx } from '../contexts/currentWorkContext'
import ListOrders from './ListOrders'
import { useEmployee } from '../contexts/employeeContext'
import DisabledEmployee from './DisabledEmployee'
import { useStore } from '../contexts/storeContext'
import ErrorBoundary from './ErrorBoundary'
import TextInfo from './TextInfo'
import SectionProgressWork from './SectionProgressWork'
import OrderType from '../types/OrderType'
import Icon, { IconName } from './Icon'
import { Dimensions } from 'react-native'
const modalSize = Dimensions.get('window')?.width > 500 ? 'md' : 'full'
const ModalCurrentWork = () => {
  /**
   *
   * This component is a modal that shows the progress of the current work of the employee.
   * 1. shows the progress of delivered/pedidos
   * 2. shows the progress of (renewed + pickedUp)/expired
   * 3. shows the progress of reports solved/unsolved
   * 4. shows the total amount of payments in the sections assigned to the employee
   * 5. if is admin shows the total amount of payments in the store
   * 6. if is admin shows the total of orders progress
   *
   */
  const { employee, permissions } = useEmployee()
  const { payments, progress } = useCurrentWorkCtx()
  const modalCurrentWork = useModal({
    title: 'Trabajo de hoy (rentas)'
  })
  if (!permissions?.canSeeCurrentWork) return <></>

  return (
    <View style={{ marginRight: 8 }}>
      <Pressable onPress={modalCurrentWork.toggleOpen}>
        <ProgressWork progress={progress?.total} size="lg" />
        <CurrencyAmount
          style={gStyles.helper}
          amount={payments_amount(payments)?.total}
        />
      </Pressable>
      <StyledModal {...modalCurrentWork} size={modalSize}>
        {employee?.disabled ? (
          <DisabledEmployee></DisabledEmployee>
        ) : (
          <>
            <ProgressWorkDetails
              onPressOrderRow={modalCurrentWork.toggleOpen}
            />
            <BalanceAmountsE payments={payments} />
          </>
        )}
      </StyledModal>
    </View>
  )
}
const ProgressWorkDetails = ({ onPressOrderRow }) => {
  const { storeSections } = useStore()
  const {
    deliveredOrders,
    authorizedOrders,
    solvedReported,
    unsolvedReported,
    pickedUpOrders,
    renewedOrders,
    expiredOrders,
    sections
  } = useCurrentWorkCtx()
  const {
    permissions: { isAdmin, isOwner }
  } = useEmployee()
  return (
    <View>
      {sections?.map((sectionId) => (
        <View key={sectionId}>
          <Text style={[gStyles.h2, { textAlign: 'center' }]}>
            {storeSections.find((s) => s.id === sectionId)?.name}
          </Text>
        </View>
      ))}
      {sections.length === 0 && (
        <Text style={[gStyles.h2, { textAlign: 'center' }]}>Todas</Text>
      )}
      <View style={{ marginVertical: 8, marginBottom: 16 }}>
        <SectionProgressWork
          authorized={authorizedOrders}
          delivered={deliveredOrders}
          expired={expiredOrders}
          resolved={[...renewedOrders, ...pickedUpOrders]}
          reported={unsolvedReported}
          reportedSolved={solvedReported}
          onPressOrderRow={onPressOrderRow}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <ModalOrders
            label="Recogidas"
            orders={pickedUpOrders as OrderType[]}
          />
          <ModalOrders
            label="Renovadas"
            orders={renewedOrders as OrderType[]}
          />
        </View>
      </View>
      {(isAdmin || isOwner) && (
        <SectionsCurrentWork onPressOrderRow={onPressOrderRow} />
      )}
    </View>
  )
}

const ModalOrders = ({
  label,
  orders = []
}: {
  label: string
  orders: OrderType[]
}) => {
  const modalOrders = useModal({ title: label })
  return (
    <View>
      <Pressable onPress={modalOrders.toggleOpen}>
        <Text style={gStyles.tBold}>
          {label} {orders?.length}
        </Text>
      </Pressable>
      <StyledModal {...modalOrders}>
        <ListOrders orders={orders} />
      </StyledModal>
    </View>
  )
}

const SectionsCurrentWork = ({ onPressOrderRow }) => {
  const { storeSections } = useStore()
  const {
    authorizedOrders,
    deliveredOrders,
    expiredOrders,
    renewedOrders,
    pickedUpOrders,
    solvedReported,
    unsolvedReported
  } = useCurrentWorkCtx()
  return (
    <View>
      {storeSections.map((section) => {
        const authorized = authorizedOrders.filter(
          (order) => order.assignToSection === section.id
        )
        const delivered = deliveredOrders.filter(
          (order) => order.assignToSection === section.id
        )
        const expired = expiredOrders.filter(
          (order) => order.assignToSection === section.id
        )
        const resolved = [...renewedOrders, ...pickedUpOrders].filter(
          (order) => order.assignToSection === section.id
        )
        const reported = unsolvedReported.filter(
          (order) => order.assignToSection === section.id
        )
        const reportedSolved = solvedReported.filter(
          (order) => order.assignToSection === section.id
        )
        if (
          [
            ...authorized,
            ...delivered,
            ...expired,
            ...resolved,
            ...reported,
            ...reportedSolved
          ].length === 0
        )
          return null

        return (
          <View key={section.id}>
            <Text style={[gStyles.h2, { textAlign: 'center' }]}>
              {section.name}
            </Text>
            <SectionProgressWork
              onPressOrderRow={onPressOrderRow}
              authorized={authorized}
              delivered={delivered}
              expired={expired}
              resolved={resolved}
              reported={reported}
              reportedSolved={reportedSolved}
            />
          </View>
        )
      })}
    </View>
  )
}

export const ProgressWork = ({
  progress = 0,
  label = '',
  width = 'auto',
  size = 'md',
  underLabel = '',
  icon
}: {
  progress: number
  label?: string
  width?: FlexStyle['width']
  size?: 'sm' | 'md' | 'lg'
  underLabel?: string
  icon?: IconName
}) => {
  //* if progress less than 25% color is error, if less than 50% color is warning, if less than 75% color is primary, else color is success
  const color =
    progress < 25
      ? 'error'
      : progress < 50
      ? 'warning'
      : progress < 75
      ? 'success'
      : 'primary'

  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 4,
        width
      }}
    >
      <Text style={[{ textAlign: 'center' }, gStyles.tBold]}>
        {icon && <Icon icon={icon} size={14} />}
        {label} {progress.toFixed(0)}%
      </Text>
      <ProgressBar progress={progress} color={color} size={size} />
      {!!underLabel && (
        <Text style={[{ textAlign: 'center' }, gStyles.helper]}>
          {underLabel}
        </Text>
      )}
    </View>
  )
}
export const ModalCurrentWorkE = (props) => (
  <ErrorBoundary componentName="ModalCurrentWork">
    <ModalCurrentWork {...props} />
  </ErrorBoundary>
)
export default ModalCurrentWork
