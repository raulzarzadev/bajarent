import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import Button from '../Button'
import useModal from '../../hooks/useModal'
import StyledModal from '../StyledModal'
import { useCurrentWork } from '../../state/features/currentWork/currentWorkSlice'
import InputSwitch from '../InputSwitch'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/authContext'
import { ServicePayments } from '../../firebase/ServicePayments'
import { BalanceAmountsE } from '../BalanceAmounts'
import { CurrentWorkUpdate } from './CurrentWorkType'
import { gStyles } from '../../styles'
const ModalCurrentWork = (props?: ModalCurrentWorkProps) => {
  const modal = useModal({ title: 'Trabajo actual' })
  const { data: currentWork, loading, fetch } = useCurrentWork()
  const { user } = useAuth()
  const [workType, setWorkType] = useState<'personal' | 'sections'>('personal')
  const [personalWorks, setPersonalWorks] = useState<CurrentWorkUpdate[]>([])
  const toggleWorkType = () => {
    setWorkType(workType === 'personal' ? 'sections' : 'personal')
  }
  const [payments, setPayments] = useState([])

  useEffect(() => {
    if (currentWork) {
      const personalWork = Object.values(currentWork?.updates || {}).filter(
        (update) => update?.createdBy === user?.id
      )
      setPersonalWorks(personalWork)
    }
  }, [currentWork])

  useEffect(() => {
    if (personalWorks.length) {
      const paymentsIs = personalWorks
        .filter((work) => work.type === 'payment')
        .map((w) => w.details.paymentId)
      ServicePayments.list(paymentsIs).then((payments) => {
        setPayments(payments)
      })
    }
  }, [personalWorks.length])

  const disabledSwitch = true

  return (
    <View>
      <Button
        justIcon
        icon="folderCheck"
        onPress={modal.toggleOpen}
        variant="ghost"
      />
      <StyledModal {...modal}>
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            marginBottom: 6
          }}
        >
          <Text
            style={[
              workType === 'sections' && gStyles.tBold,
              disabledSwitch && { opacity: 0.5 }
            ]}
          >
            Por area
          </Text>
          <InputSwitch
            value={workType === 'personal'}
            disabled={disabledSwitch}
            setValue={() => {
              toggleWorkType()
            }}
          />
          <Text
            style={[
              workType === 'personal' && gStyles.tBold,
              disabledSwitch && { opacity: 0.5 }
            ]}
          >
            Personal
          </Text>
        </View>
        {workType === 'personal' && (
          <View>
            <BalanceAmountsE payments={payments} disableLinks />
          </View>
        )}
      </StyledModal>
    </View>
  )
}
export default ModalCurrentWork
export type ModalCurrentWorkProps = {}
export const ModalCurrentWorkE = (props: ModalCurrentWorkProps) => (
  <ErrorBoundary componentName="ModalCurrentWork">
    <ModalCurrentWork {...props} />
  </ErrorBoundary>
)
