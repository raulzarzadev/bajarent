import { FlexStyle, Pressable, Text, View } from 'react-native'
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
  const modalCurrentWork = useModal({ title: 'Trabajo de hoy (rentas)' })
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
      <StyledModal {...modalCurrentWork}>
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
  return (
    <View>
      {sections?.map((sectionId) => (
        <View key={sectionId}>
          <Text style={[gStyles.h2, { textAlign: 'center' }]}>
            {storeSections.find((s) => s.id === sectionId)?.name}
          </Text>
        </View>
      ))}
      <SectionProgressWork
        authorized={authorizedOrders}
        delivered={deliveredOrders}
        expired={expiredOrders}
        resolved={[...renewedOrders, ...pickedUpOrders]}
        reported={unsolvedReported}
        reportedSolved={solvedReported}
        onPressOrderRow={onPressOrderRow}
      />
    </View>
  )
}

export const ProgressWork = ({
  progress = 0,
  label = '',
  width = 'auto',
  size = 'md',
  underLabel = ''
}: {
  progress: number
  label?: string
  width?: FlexStyle['width']
  size?: 'sm' | 'md' | 'lg'
  underLabel?: string
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
