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
import asDate, { dateFormat } from '../../libs/utils-date'
import dictionary from '../../dictionary'
import { useStore } from '../../contexts/storeContext'
import { useOrdersRedux } from '../../hooks/useOrdersRedux'
import { useCustomers } from '../../state/features/costumers/costumersSlice'
import OrderType from '../../types/OrderType'
import { CustomerType } from '../../state/features/costumers/customerType'
import { BadgeListSectionsE } from '../BadgeListSections'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import PaymentType from '../../types/PaymentType'

export const current_works_view = ['sections', 'personal'] as const
export type CurrentWorkView = (typeof current_works_view)[number]
export const current_works_labels: Record<CurrentWorkView, string> = {
  sections: 'Areas',
  personal: 'Personal'
}

const ViewCurrentWork = (props?: ViewCurrentWorkProps) => {
  type CurrentWorkTypeWithOrderAndCustomerData = CurrentWorkUpdate & {
    order?: Partial<OrderType>
    customer?: Partial<CustomerType>
  }
  const { data: currentWork } = useCurrentWork()
  const { user } = useAuth()
  const { employee } = useEmployee()
  const { sections, storeId } = useStore()
  const { data: customers } = useCustomers()

  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  const [workType, setWorkType] = useState<CurrentWorkView>('sections')

  const [orders, setOrders] = useState<OrderType[]>([])
  const [currentUpdates, setCurrentUpdates] = useState<
    CurrentWorkTypeWithOrderAndCustomerData[]
  >([])

  const [todayPayments, setTodayPayments] = useState<PaymentType[]>([])

  const [sectionsWithUpdates, setSectionsWithUpdates] = useState<string[]>([])

  const [payments, setPayments] = useState<PaymentType[]>([])

  const toggleWorkType = () => {
    const newWorkType = workType === 'sections' ? 'personal' : 'sections'
    setWorkType(newWorkType)
    handleSetCurrentWorks(newWorkType)
  }

  useEffect(() => {
    //* find all orders that have updates in the current work
    const ordersWitUpdatesUniqueIds = Object.values(currentWork?.updates || {})
      .map((update) => update.details?.orderId)
      .filter((id) => id)
      .filter((id, index, self) => self.indexOf(id) === index)
    ServiceOrders.getList(ordersWitUpdatesUniqueIds).then((orders) => {
      setOrders(orders)
    })
  }, [currentWork?.updates])

  useEffect(() => {
    if (storeId) {
      ServicePayments.getToday(storeId)
        .then((payments) => {
          setTodayPayments(payments)
        })
        .catch(console.error)
    }
  }, [storeId])

  useEffect(() => {
    if (customers.length && orders.length) {
      handleSetCurrentWorks(workType)
    }
  }, [customers, orders])

  const handleSetCurrentWorks = (workType: CurrentWorkView) => {
    if (workType === 'personal') {
      //* 1. SET PERSONAL UPDATES
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

      //* GET SECTIONS WITH
      const sectionsWithUpdates = personalUpdates
        .map((update) => update.details?.sectionId)
        .filter((sectionId) => sectionId)
        .filter((sectionId, index, self) => self.indexOf(sectionId) === index)
      setSectionsWithUpdates(sectionsWithUpdates)

      //TODO: set personal payments from orders
      const personalPayments = todayPayments.filter(
        (p) => p.createdBy === user?.id && p.storeId === storeId
      )
      setPayments(personalPayments)
    } else {
      //* 1. SET MY SECTIONS UPDATES
      //* ** ! should be calculated from the current order state.
      const mySections = employee?.sectionsAssigned || []
      const workOrdersBySections = mySections.reduce((acc, section) => {
        const sectionOrders = orders.filter(
          (o) => o.assignToSection === section
        )
        if (sectionOrders.length > 0) {
          acc[section] = sectionOrders
        }
        return acc
      }, {})
      setSectionsWithUpdates(Object.keys(workOrdersBySections))

      const sectionsUpdates = Object.values(currentWork?.updates || {})
        .filter((update) => mySections.includes(update.details?.sectionId))
        .map((update) => {
          const order = orders.find((o) => o.id === update.details?.orderId)
          const customer = customers.find((c) => c.id === order?.customerId)
          return {
            ...update,
            order,
            customer
          }
        })
      setCurrentUpdates(sectionsUpdates)

      //TODO: set sections payments
      const sectionOrders = Object.values(
        workOrdersBySections
      ).flat() as OrderType[]
      const sectionPayments = todayPayments.filter((p) =>
        sectionOrders.some((o) => o.id === p.orderId)
      )
      setPayments(sectionPayments)
    }
  }

  const handleSetSelectedSection = (sectionId: string) => {
    if (selectedSection === sectionId) {
      setSelectedSection(null)
    } else {
      setSelectedSection(sectionId)
    }
  }

  const DISABLED_SWITCH = false

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
            DISABLED_SWITCH && { opacity: 0.5 }
          ]}
        >
          Areas{' '}
        </Text>

        <InputSwitch
          value={workType === 'personal'}
          colorFalse="success"
          disabled={DISABLED_SWITCH}
          setValue={() => {
            toggleWorkType()
          }}
        />
        <Text
          style={[
            workType === 'personal' && gStyles.tBold,
            DISABLED_SWITCH && { opacity: 0.5 }
          ]}
        >
          Personal
        </Text>
      </View>

      {/* ********** BADGE SECTIONS LISTS ********** */}
      <BadgeListSectionsE
        sections={sectionsWithUpdates.map((sectionId) =>
          sections.find((s) => s.id === sectionId)
        )}
        selectedSection={selectedSection}
        onPressSection={({ sectionId }) => {
          handleSetSelectedSection(sectionId)
        }}
      />
      {/* ********** BALANCE AMOUNTS ********** */}
      <View style={{ marginVertical: 12 }}>
        <BalanceAmountsE payments={payments} />
      </View>
      {/* ********** UPDATES LIST ********** */}

      {currentUpdates?.map((update, i) => (
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
              <Text style={gStyles.helper}>{dictionary(update.action)} - </Text>
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
// function getOrdersByCurrentSection(sectionsMap) {
//   // 1. Primero calculamos para cada orderId su última sección
//   const latestByOrder = {}

//   for (const sectionId in sectionsMap) {
//     for (const update of sectionsMap[sectionId]) {
//       const { orderId, createdAt } = update
//       const timestamp = new Date(createdAt)

//       if (
//         !latestByOrder[orderId] ||
//         timestamp > new Date(latestByOrder[orderId].createdAt)
//       ) {
//         latestByOrder[orderId] = { sectionId, createdAt }
//       }
//     }
//   }

//   // 2. Ahora invertimos ese mapping para agrupar por sección
//   const ordersBySection = {}

//   for (const [orderId, { sectionId }] of Object.entries(latestByOrder)) {
//     if (!ordersBySection[sectionId]) {
//       ordersBySection[sectionId] = []
//     }
//     ordersBySection[sectionId].push(orderId)
//   }

//   return ordersBySection
// }
