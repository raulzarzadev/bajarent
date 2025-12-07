import { useCallback, useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { useAuth } from '../../contexts/authContext'
import { useEmployee } from '../../contexts/employeeContext'
import { useStore } from '../../contexts/storeContext'
import dictionary from '../../dictionary'
import { ServicePayments } from '../../firebase/ServicePayments'
import { useOrdersRedux } from '../../hooks/useOrdersRedux'
import asDate, { dateFormat, getTimeSafe } from '../../libs/utils-date'
import { useCustomers } from '../../state/features/costumers/costumersSlice'
import type { CustomerType } from '../../state/features/costumers/customerType'
import { useCurrentWork } from '../../state/features/currentWork/currentWorkSlice'
import { gStyles } from '../../styles'
import type OrderType from '../../types/OrderType'
import type PaymentType from '../../types/PaymentType'
import { BadgeListSectionsE } from '../BadgeListSections'
import { BalanceAmountsE } from '../BalanceAmounts'
import ErrorBoundary from '../ErrorBoundary'
import InputSwitch from '../InputSwitch'
import Loading from '../Loading'
import type { CurrentWorkType, CurrentWorkUpdate } from './CurrentWorkType'

export const current_works_view = ['sections', 'personal'] as const
export type CurrentWorkView = (typeof current_works_view)[number]
export const current_works_labels: Record<CurrentWorkView, string> = {
  sections: 'Areas',
  personal: 'Personal'
}

const ViewCurrentWork = () => {
  type CurrentWorkTypeWithOrderAndCustomerData = CurrentWorkUpdate & {
    order?: Partial<OrderType>
    customer?: Partial<CustomerType>
  }
  const { data: currentWork } = useCurrentWork()
  const { orders, setSomeOtherOrders } = useOrdersRedux()

  const { user } = useAuth()
  const { employee } = useEmployee()
  const { sections, storeId } = useStore()
  const { data: customers } = useCustomers()

  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  const [workType, setWorkType] = useState<CurrentWorkView>()

  const [currentUpdates, setCurrentUpdates] = useState<
    CurrentWorkTypeWithOrderAndCustomerData[]
  >([])

  const [filteredUpdates, setFilteredUpdates] = useState<
    CurrentWorkTypeWithOrderAndCustomerData[]
  >([])

  const [todayPayments, setTodayPayments] = useState<PaymentType[]>([])

  const [sectionsWithUpdates, setSectionsWithUpdates] = useState<string[]>([])

  const [payments, setPayments] = useState<PaymentType[]>([])

  useEffect(() => {
    if (currentWork) {
      const ordersWitUpdatesUniqueIds = Object.values(
        currentWork?.updates || {}
      )
        .map((update) => update.details?.orderId)
        .filter((id) => id)
        .filter((id, index, self) => self.indexOf(id) === index)

      setSomeOtherOrders({ ordersIds: ordersWitUpdatesUniqueIds })
      setCurrentUpdates(Object.values(currentWork?.updates || {}))
    }
  }, [currentWork])

  useEffect(() => {
    if (storeId) {
      ServicePayments.getToday(storeId)
        .then((payments) => {
          setTodayPayments(payments)
        })
        .catch(console.error)
    }
  }, [storeId])

  const handleSetCurrentWorks = useCallback(
    (workType: CurrentWorkView) => {
      const currentUpdatesWithData = currentUpdates.map((update) => {
        const order = orders.find((o) => o.id === update.details?.orderId)
        const customer = customers.find((c) => c.id === order?.customerId)
        return {
          ...update,
          order,
          customer
        } as CurrentWorkTypeWithOrderAndCustomerData
      })

      if (workType === 'personal') {
        //* 1. SET PERSONAL UPDATES
        const personalUpdates = currentUpdatesWithData.filter(
          (update) => update?.createdBy === user?.id
        )

        setFilteredUpdates(personalUpdates)

        //* GET SECTIONS WITH
        const sectionsWithUpdates = personalUpdates
          .map((update) => update.details?.sectionId)
          .filter((sectionId) => sectionId)
          .filter((sectionId, index, self) => self.indexOf(sectionId) === index)
        setSectionsWithUpdates(sectionsWithUpdates)

        // set personal payments from orders
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

        const sectionsUpdates = currentUpdatesWithData.filter((update) =>
          mySections.includes(update.order?.assignToSection)
        )

        setFilteredUpdates(sectionsUpdates)

        //TODO: set sections payments
        const sectionOrders = Object.values(
          workOrdersBySections
        ).flat() as OrderType[]
        const sectionPayments = todayPayments.filter((p) =>
          sectionOrders.some((o) => o.id === p.orderId)
        )
        setPayments(sectionPayments)
      }
    },
    [
      currentUpdates,
      orders,
      customers,
      user?.id,
      todayPayments,
      storeId,
      employee?.sectionsAssigned
    ]
  )

  const toggleWorkType = () => {
    const newWorkType = workType === 'sections' ? 'personal' : 'sections'
    setWorkType(newWorkType)
    handleSetCurrentWorks(newWorkType)
  }

  const handleSetSelectedSection = useCallback(
    (sectionId: string) => {
      if (selectedSection === sectionId) {
        setSelectedSection(null)
        setPayments(todayPayments) // Reset to all payments
        handleSetCurrentWorks(workType)
      } else {
        setSelectedSection(sectionId)
        const sectionOrders = orders.filter(
          (o) => o.assignToSection === sectionId
        )
        const sectionPayments = todayPayments.filter((p) =>
          sectionOrders.some((o) => o.id === p.orderId)
        )

        // Recalcular currentUpdatesWithData aquí también
        const currentUpdatesWithData = currentUpdates.map((update) => {
          const order = orders.find((o) => o.id === update.details?.orderId)
          const customer = customers.find((c) => c.id === order?.customerId)
          return {
            ...update,
            order,
            customer
          } as CurrentWorkTypeWithOrderAndCustomerData
        })

        const sectionUpdates = currentUpdatesWithData.filter(
          (update) => update?.order?.assignToSection === sectionId
        )
        setFilteredUpdates(sectionUpdates)
        setPayments(sectionPayments)
      }
    },
    [
      selectedSection,
      todayPayments,
      workType,
      handleSetCurrentWorks,
      orders,
      currentUpdates,
      customers
    ]
  )

  const DISABLED_SWITCH = false

  if (!currentWork) return <Loading />

  const formatTimeSafe = (value: unknown): string => {
    try {
      const d: any = asDate(value as any)
      return d && typeof d.getTime === 'function' && !isNaN(d.getTime())
        ? dateFormat(d, 'HH:mm:ss')
        : ''
    } catch {
      return ''
    }
  }

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

      {filteredUpdates
        .sort((a, b) => {
          return getTimeSafe(b?.createdAt) - getTimeSafe(a?.createdAt)
        })
        ?.map((update) => (
          <View
            key={update.id}
            style={{
              marginBottom: 8,
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Text style={[{ marginRight: 4 }, gStyles.helper]}>
              {formatTimeSafe(update.createdAt)}
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
            {update?.order?.assignToSection && (
              <Text style={[gStyles.helper, gStyles.tBold]}>
                {sections.find(
                  (section) => section.id === update.order.assignToSection
                )?.name || update.order.assignToSection}
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
