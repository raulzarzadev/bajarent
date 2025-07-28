import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { useAuth } from '../../contexts/authContext'
import { useCurrentWork } from '../../state/features/currentWork/currentWorkSlice'
import { useEmployee } from '../../contexts/employeeContext'
import { useEffect, useState } from 'react'
import { CurrentWorkType, CurrentWorkUpdate } from './CurrentWorkType'
import { ServicePayments } from '../../firebase/ServicePayments'
import InputSwitch from '../InputSwitch'
import { gStyles } from '../../styles'
import { BalanceAmountsE } from '../BalanceAmounts'
import { EmployeeSections } from '../CardEmployee'
import asDate, { dateFormat } from '../../libs/utils-date'
import dictionary from '../../dictionary'
import { useStore } from '../../contexts/storeContext'
import { useOrdersRedux } from '../../hooks/useOrdersRedux'
import { useCustomers } from '../../state/features/costumers/costumersSlice'
import OrderType from '../../types/OrderType'
import { CustomerType } from '../../state/features/costumers/customerType'

const ViewCurrentWork = (props?: ViewCurrentWorkProps) => {
  type CurrentWorkTypeWithOrderAndCustomerData = CurrentWorkUpdate & {
    order?: Partial<OrderType>
    customer?: Partial<CustomerType>
  }
  const { data: currentWork } = useCurrentWork()
  const { user } = useAuth()
  const { employee } = useEmployee()
  const { sections } = useStore()
  const { data: customers } = useCustomers()
  const [workType, setWorkType] = useState<'personal' | 'sections'>('sections')
  const [personalWorks, setPersonalWorks] = useState<CurrentWorkUpdate[]>([])
  const [sectionWorks, setSectionWorks] = useState<CurrentWorkUpdate[]>([])
  const [currentUpdates, setCurrentUpdates] = useState<
    CurrentWorkTypeWithOrderAndCustomerData[]
  >([])
  const { orders, setSomeOtherOrders } = useOrdersRedux()

  const toggleWorkType = () => {
    console.log({ orders, customers })
    setWorkType(workType === 'personal' ? 'sections' : 'personal')
    if (workType === 'personal') {
      const personalUpdates = Object.values(currentWork?.updates || {})
        .filter((update) => update?.createdBy === user?.id)
        .map((update) => {
          const order = orders.find((o) => o.id === update.details?.orderId)
          const customer = customers.find((c) => c.id === order?.customerId)
          return {
            ...update,
            order,
            customer
          }
        })
      setCurrentUpdates(personalUpdates)
    } else {
      const assignedSectionsUpdates = getSectionsWorks({
        currentWork,
        sections: employee?.sectionsAssigned || []
      })

      setCurrentUpdates(
        assignedSectionsUpdates.map((update) => {
          const order = orders.find((o) => o.id === update.details?.orderId)
          const customer = customers.find((c) => c.id === order?.customerId)
          return {
            ...update,
            order,
            customer
          }
        })
      )
    }
  }

  useEffect(() => {
    if (currentWork) {
      toggleWorkType()
      setSomeOtherOrders({
        ordersIds: Object.values(currentWork?.updates || {})
          .filter((update) => update?.type === 'order')
          .map((update) => update.details?.orderId)
      })
    }
  }, [currentWork])

  const [personalPayments, setPersonalPayments] = useState([])

  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [selectedSectionPayment, setSelectedSectionPayments] = useState([])

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

  console.log({ currentUpdates })

  return (
    <View style={[gStyles.container]}>
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
      {/* Un historial del trabajo  */}
      {currentUpdates.length > 0 && (
        <View>
          {currentUpdates.map((update, i) => (
            <View
              key={i}
              style={{
                marginBottom: 8,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Text style={[{ marginRight: 4 }, gStyles.helper]}>
                {dateFormat(asDate(update.createdAt), 'HH:mm:ss')}
              </Text>
              <Text style={[{ marginRight: 4 }, gStyles.helper, gStyles.tBold]}>
                {update?.order?.folio}
              </Text>
              {!!update?.customer && (
                <>
                  <Text style={gStyles.helper}>
                    {dictionary(update.action)} -{' '}
                  </Text>
                  <Text style={[{ marginRight: 4 }, gStyles.helper]}>
                    {update?.customer?.name}
                  </Text>
                </>
              )}

              <Text style={gStyles.helper}> - </Text>
              {update.details?.sectionId && (
                <Text style={gStyles.helper}>
                  <Text style={gStyles.tBold}>
                    {sections.find(
                      (section) => section.id === update.details.sectionId
                    )?.name || update.details.sectionId}
                  </Text>
                </Text>
              )}
            </View>
          ))}
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

export const getSectionsWorks = ({
  currentWork,
  sections
}: {
  currentWork: CurrentWorkType
  sections: string[]
}) => {
  const updates = Object.values(currentWork?.updates || {})

  const res = updates.filter((update) =>
    sections.includes(update?.details?.sectionId)
  )
  console.log({ res, updates })

  return res
}

/**
 * Dado un objeto donde cada clave es un sectionId y su valor
 * es un array de actualizaciones (con orderId y createdAt),
 * devuelve un objeto que mapea cada sectionId a un array
 * con los orderId que están actualmente en esa sección.
 *
 * @param {Object<string, Array<{ orderId: string, createdAt: string }>>} sectionsMap
 * @returns {Object<string, string[]>} sectionId → [orderId, ...]
 */
function getOrdersByCurrentSection(sectionsMap) {
  // 1. Primero calculamos para cada orderId su última sección
  const latestByOrder = {}

  for (const sectionId in sectionsMap) {
    for (const update of sectionsMap[sectionId]) {
      const { orderId, createdAt } = update
      const timestamp = new Date(createdAt)

      if (
        !latestByOrder[orderId] ||
        timestamp > new Date(latestByOrder[orderId].createdAt)
      ) {
        latestByOrder[orderId] = { sectionId, createdAt }
      }
    }
  }

  // 2. Ahora invertimos ese mapping para agrupar por sección
  const ordersBySection = {}

  for (const [orderId, { sectionId }] of Object.entries(latestByOrder)) {
    if (!ordersBySection[sectionId]) {
      ordersBySection[sectionId] = []
    }
    ordersBySection[sectionId].push(orderId)
  }

  return ordersBySection
}
