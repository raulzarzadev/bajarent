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
const ModalCurrentWork = (props?: ModalCurrentWorkProps) => {
  const modal = useModal({ title: 'Trabajo actual' })
  const { data: currentWork, loading } = useCurrentWork()
  const { user } = useAuth()
  const [workType, setWorkType] = useState<'personal' | 'sections'>('personal')

  const toggleWorkType = () => {
    setWorkType(workType === 'personal' ? 'sections' : 'personal')
  }
  const [payments, setPayments] = useState([])

  useEffect(() => {
    if (currentWork) {
      const workUpdates = Object.values(currentWork?.updates || {})
      const personalWork = workUpdates.filter(
        (update) => update?.createdBy === user?.id
      )

      const userPaymentsIds = personalWork
        .filter((update) => update.type == 'payment')
        .map((update) => update.details?.paymentId)
      ServicePayments.list(userPaymentsIds).then((payments) => {
        setPayments(payments)
      })
    }
  }, [currentWork])
  console.log({ payments, currentWork, loading })

  return (
    <View>
      <Button
        justIcon
        icon="balance"
        onPress={modal.toggleOpen}
        variant="ghost"
      />
      <StyledModal {...modal}>
        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
          <Text>Por area</Text>
          <InputSwitch
            value={workType === 'personal'}
            disabled={true}
            setValue={() => {
              toggleWorkType()
            }}
          />
          <Text>Personal</Text>
        </View>
        {workType === 'personal' && <View></View>}
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
