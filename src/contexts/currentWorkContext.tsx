import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect
} from 'react'
import OrderType, {
  order_status,
  TypeOrder,
  TypeOrderType
} from '../types/OrderType'
import { useOrdersCtx } from './ordersContext'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useStore } from './storeContext'
import { useEmployee } from './employeeContext'
import { endDate, startDate } from '../libs/utils-date'
import PaymentType from '../types/PaymentType'
import { ServicePayments } from '../firebase/ServicePayments'
import { where } from 'firebase/firestore'
import { ServiceComments } from '../firebase/ServiceComments'

const CurrentWorkContext = createContext<CurrentWorks | undefined>(undefined)
const defaultCurrentWork: CurrentWorks = {
  sections: [],
  pickedUpOrders: [],
  deliveredOrders: [],
  renewedOrders: [],
  authorizedOrders: [],
  solvedReported: [],
  unsolvedReported: [],
  payments: [],
  expiredOrders: [],
  progress: {
    new: 0,
    reports: 0,
    expired: 0,
    total: 0
  }
}
export type CurrentWorks = {
  sections: string[]
  pickedUpOrders: Partial<OrderType>[]
  deliveredOrders: Partial<OrderType>[]
  renewedOrders: Partial<OrderType>[]
  authorizedOrders: Partial<OrderType>[]
  solvedReported: Partial<OrderType>[]
  unsolvedReported: Partial<OrderType>[]
  expiredOrders: Partial<OrderType>[]
  payments: Partial<PaymentType>[]
  progress: {
    new: number
    reports: number
    expired: number
    total: number
  }
}

export const CurrentWorkProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [date, setDate] = useState(new Date())
  const { storeId } = useStore()
  const { employee } = useEmployee()

  const sectionsAssigned = employee?.sectionsAssigned || []

  const { orders } = useOrdersCtx()
  const [currentWork, setCurrentWork] =
    useState<CurrentWorks>(defaultCurrentWork)

  useEffect(() => {
    if (orders?.length) {
      handleSetData({ disabledEmployee: employee?.disabled })
    }
  }, [orders, employee?.disabled])

  const handleSetData = ({ disabledEmployee = false }) => {
    if (disabledEmployee) {
      return setCurrentWork(defaultCurrentWork)
    }

    console.log({ sectionsAssigned })

    getCurrentWork({
      date,
      storeId,
      sectionsAssigned,
      orderType: TypeOrder.RENT,
      currentOrders: orders
    }).then((data) => {
      setCurrentWork({ ...data })
    })
  }

  return (
    <CurrentWorkContext.Provider value={currentWork}>
      {children}
    </CurrentWorkContext.Provider>
  )
}

export const useCurrentWorkCtx = (): CurrentWorks => {
  const context = useContext(CurrentWorkContext)
  if (!context) {
    throw new Error('useCurrentWork must be used within a CurrentWorkProvider')
  }
  return context
}

function calculateProgress(done = 0, pending = 0) {
  // Calculate the total number of orders
  const total = done + pending

  // If there are no orders (done + pending is 0), the progress is 100
  if (total === 0) {
    return 100
  }

  // Calculate the progress based on done orders over the total
  const progress = (done / total) * 100

  // Round the progress to two decimal places if needed
  return Math.round(progress * 100) / 100
}

const getCurrentWork = async ({
  storeId = '',
  sectionsAssigned = [],
  date = new Date(),
  orderType,
  currentOrders = []
}: {
  storeId: string
  sectionsAssigned: string[]
  date: Date
  orderType?: TypeOrderType
  currentOrders: Partial<OrderType>[]
}) => {
  // if sectionsAssigned.length is 0, should will get info of all orders
  try {
    const NUMBER_OF_METRICS = 3
    const pickedUpPromise = ServiceOrders.getPickedUp({
      storeId,
      sections: sectionsAssigned,
      fromDate: startDate(date),
      toDate: endDate(date),
      orderType
    })
    const deliveredPromise = ServiceOrders.getDelivered({
      storeId,
      sections: sectionsAssigned,
      fromDate: startDate(date),
      toDate: endDate(date),
      orderType
    })

    const renewedPromise = ServiceOrders.getRenewed({
      storeId,
      sections: sectionsAssigned,
      fromDate: startDate(date),
      toDate: endDate(date),
      orderType
    })

    const solvedReportsOrdersPromises = ServiceComments.getSolvedReportsByDate({
      storeId,
      fromDate: startDate(new Date()),
      toDate: endDate(new Date())
    })
      .then((reports) => {
        console.log({ reports })
        const ordersIds = Array.from(new Set(reports.map((r) => r.orderId)))
        return ordersIds.map((orderId) => ServiceOrders.get(orderId))
      })
      .then((ordersPromises) => {
        return Promise.all(ordersPromises)
      })

    const [pickedUp, delivered, renewed, reportedSolved] = await Promise.all([
      pickedUpPromise,
      deliveredPromise,
      renewedPromise,
      solvedReportsOrdersPromises
    ])

    const authorized = currentOrders.filter(
      (o) => o.status === order_status.AUTHORIZED
    )

    const solvedOrders = [...renewed, ...delivered].filter((o) => {
      return sectionsAssigned.length > 0
        ? sectionsAssigned.includes(o.assignToSection)
        : true
    })
    const solvedReportsInSectionAssigned = reportedSolved.filter((o) =>
      sectionsAssigned.length > 0
        ? sectionsAssigned.includes(o.assignToSection)
        : true
    )
    const unsolvedReportedInSectionAssigned = currentOrders.filter(
      (o) => o.hasNotSolvedReports
    )

    const paidOrders = await ServicePayments.getInList({
      list: solvedOrders.map(({ id }) => id),
      field: 'orderId',
      moreFilters: [
        where('createdAt', '>=', startDate(date)),
        where('createdAt', '<=', endDate(date))
      ]
    })

    const reports = calculateProgress(
      solvedReportsInSectionAssigned?.length,
      unsolvedReportedInSectionAssigned?.length
    )

    const newOrders = calculateProgress(delivered?.length, authorized?.length)
    const expiredOrders = currentOrders.filter(
      (o) => o.expiresToday || o.isExpired
    )
    const expiredProgress = calculateProgress(
      renewed?.length + pickedUp?.length,
      expiredOrders?.length
    )

    const total = (newOrders + reports + expiredProgress) / NUMBER_OF_METRICS //*the number of metrics used

    return {
      pickedUpOrders: pickedUp,
      deliveredOrders: delivered,
      renewedOrders: renewed,
      authorizedOrders: authorized,
      solvedReported: solvedReportsInSectionAssigned,
      unsolvedReported: unsolvedReportedInSectionAssigned,
      payments: paidOrders,
      expiredOrders,
      sections: sectionsAssigned,
      progress: {
        new: newOrders,
        reports,
        expired: expiredProgress,
        total
      }
    }
  } catch (error) {
    console.log('error', error)
    return defaultCurrentWork
  }
  // setCurrentWork()
}
