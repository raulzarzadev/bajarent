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
import { useEmployee } from '../../contexts/employeeContext'
import { EmployeeSections } from '../CardEmployee'

const ModalCurrentWork = (props?: ModalCurrentWorkProps) => {
  const modal = useModal({ title: 'Trabajo actual' })
  const { data: currentWork } = useCurrentWork()
  const { user } = useAuth()
  const { employee } = useEmployee()
  const [workType, setWorkType] = useState<'personal' | 'sections'>('sections')
  const [personalWorks, setPersonalWorks] = useState<CurrentWorkUpdate[]>([])
  const [sectionWorks, setSectionWorks] = useState<CurrentWorkUpdate[]>([])
  const toggleWorkType = () => {
    setWorkType(workType === 'personal' ? 'sections' : 'personal')
  }
  const [personalPayments, setPersonalPayments] = useState([])
  const [sectionPayments, setSectionPayments] = useState([])
  const [allPayments, setAllPayments] = useState([])

  useEffect(() => {
    if (currentWork) {
      const personalWork = Object.values(currentWork?.updates || {}).filter(
        (update) => update?.createdBy === user?.id
      )
      const sectionWork = Object.values(currentWork?.updates || {}).filter(
        (update) =>
          employee?.sectionsAssigned?.includes(update?.details?.sectionId)
      )
      setSectionWorks(sectionWork)
      setPersonalWorks(personalWork)
    }
  }, [currentWork, employee?.sectionsAssigned])

  useEffect(() => {
    if (personalWorks.length) {
      const paymentsIs = personalWorks
        .filter((work) => work.type === 'payment')
        .map((w) => w.details.paymentId)
      ServicePayments.list(paymentsIs).then((payments) => {
        setPersonalPayments(payments)
      })
      const allPaymentsIds = Object.values(currentWork.updates || {})
        .filter((update) => update.type === 'payment')
        .map((update) => update.details.paymentId)
      ServicePayments.list(allPaymentsIds).then((payments) => {
        setAllPayments(payments)
      })
    }
  }, [personalWorks.length])

  useEffect(() => {
    console.log({ sectionWorks })
    if (workType === 'sections' && sectionWorks.length) {
      const paymentsIs = sectionWorks
        .filter((work) => work.type === 'payment')
        .map((w) => w.details.paymentId)
      console.log({ paymentsIs })
      ServicePayments.list(paymentsIs).then((payments) => {
        setSectionPayments(payments)
      })
    }
  }, [sectionWorks.length, workType])

  const disabledSwitch = false

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
            Areas{' '}
          </Text>

          <InputSwitch
            value={workType === 'personal'}
            colorFalse="success"
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
            <BalanceAmountsE payments={personalPayments} disableLinks />
          </View>
        )}
        {workType === 'sections' && (
          <View>
            <EmployeeSections />
            <BalanceAmountsE payments={sectionPayments} disableLinks />
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
