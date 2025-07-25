import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { useAuth } from '../../contexts/authContext'
import { useCurrentWork } from '../../state/features/currentWork/currentWorkSlice'
import { useEmployee } from '../../contexts/employeeContext'
import { useEffect, useState } from 'react'
import { CurrentWorkUpdate } from './CurrentWorkType'
import { ServicePayments } from '../../firebase/ServicePayments'
import InputSwitch from '../InputSwitch'
import { gStyles } from '../../styles'
import { BalanceAmountsE } from '../BalanceAmounts'
import { EmployeeSections } from '../CardEmployee'

const ViewCurrentWork = (props?: ViewCurrentWorkProps) => {
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

  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [selectedSectionPayment, setSelectedSectionPayments] = useState([])

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
    }
  }, [personalWorks.length])

  useEffect(() => {
    if (workType === 'sections' && sectionWorks.length) {
      const paymentsIs = sectionWorks
        .filter((work) => work.type === 'payment')
        .map((w) => w.details.paymentId)
      ServicePayments.list(paymentsIs).then((payments) => {
        setSelectedSectionPayments(payments)
      })
    }
  }, [sectionWorks.length, workType])

  const disabledSwitch = false

  const handleFilterBySection = ({ sectionId }: { sectionId: string }) => {
    if (selectedSection === sectionId) {
      setSelectedSection(null)
      const paymentsIs = sectionWorks
        .filter((work) => work.type === 'payment')
        .map((w) => w.details.paymentId)
      ServicePayments.list(paymentsIs).then((payments) => {
        setSelectedSectionPayments(payments)
      })
    } else {
      setSelectedSection(sectionId)
      const sectionFilteredWorks = sectionWorks.filter(
        (work) => work.details?.sectionId === sectionId
      )
      const paymentsIs = sectionFilteredWorks
        .filter((work) => work.type === 'payment')
        .map((w) => w.details.paymentId)
      ServicePayments.list(paymentsIs).then((payments) => {
        setSelectedSectionPayments(payments)
      })
    }
  }
  return (
    <View>
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
          <BalanceAmountsE payments={personalPayments} />
        </View>
      )}
      {workType === 'sections' && (
        <View>
          <EmployeeSections
            onPressSection={({ sectionId }) => {
              handleFilterBySection({ sectionId })
            }}
            selectedSection={selectedSection}
          />
          <BalanceAmountsE payments={selectedSectionPayment} />
        </View>
      )}
    </View>
  )
}
export default ViewCurrentWork
export type ViewCurrentWorkProps = {}
export const ViewCurrentWorkE = (props: ViewCurrentWorkProps) => (
  <ErrorBoundary componentName="ViewCurrentWork">
    <ViewCurrentWork {...props} />
  </ErrorBoundary>
)
