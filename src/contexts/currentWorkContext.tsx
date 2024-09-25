import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect
} from 'react'
import OrderType, { TypeOrder, TypeOrderType } from '../types/OrderType'
import { useOrdersCtx } from './ordersContext'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useStore } from './storeContext'
import { useEmployee } from './employeeContext'
import asDate, { endDate, startDate } from '../libs/utils-date'
import PaymentType from '../types/PaymentType'
import { ServicePayments } from '../firebase/ServicePayments'
import { isToday } from 'date-fns'
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
    const expiredOrders = orders?.filter(
      (order) => order.expiresToday || order?.isExpired
    )

    const unsolvedReported = orders.filter((o) =>
      o.comments.find((c) => c.type === 'report' && !c.solved)
    )

    getCurrentWork({
      date,
      storeId,
      sectionsAssigned,
      unsolvedReported: unsolvedReported,
      orderType: TypeOrder.RENT,
      expiredOrders
    }).then((data) => {
      setCurrentWork({ ...data, sections: sectionsAssigned })
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
  unsolvedReported = [],
  expiredOrders = [],
  orderType
}: {
  storeId: string
  sectionsAssigned: string[]
  date: Date
  orderType?: TypeOrderType
  unsolvedReported: Partial<OrderType>[]
  expiredOrders: Partial<OrderType>[]
}) => {
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

    const authorizedPromise = ServiceOrders.getAuthorized({
      storeId,
      sections: sectionsAssigned,
      orderType
    })

    const solvedReportsOrdersPromises = ServiceComments.getSolvedReportsByDate({
      storeId,
      fromDate: startDate(new Date()),
      toDate: endDate(new Date())
    }).then((reports) => {
      const ordersIds = Array.from(new Set(reports.map((r) => r.orderId)))
      return ordersIds.map((orderId) => ServiceOrders.get(orderId))
    })

    const [pickedUp, delivered, renewed, authorized, reportedSolved] =
      await Promise.all([
        pickedUpPromise,
        deliveredPromise,
        renewedPromise,
        authorizedPromise,
        solvedReportsOrdersPromises
      ])

    const reports = calculateProgress(
      reportedSolved?.length,
      unsolvedReported?.length
    )

    const newOrders = calculateProgress(delivered?.length, authorized?.length)

    const expired = calculateProgress(
      renewed?.length + pickedUp?.length,
      expiredOrders?.length
    )

    /*
  Para tener todas los pagos, debemos tener en cuenta los pagos de las nuevas rentas y los pagos de las renovacioones de 
   */

    const ordersInSectionAssigned = [...renewed, ...delivered].filter((o) => {
      return sectionsAssigned.includes(o.assignToSection)
    })

    const solvedOrdersPayments = await ServicePayments.getInList({
      list: ordersInSectionAssigned.map(({ id }) => id),
      field: 'orderId',
      moreFilters: [
        where('createdAt', '>=', startDate(date)),
        where('createdAt', '<=', endDate(date))
      ]
    })

    const total = (newOrders + reports + expired) / NUMBER_OF_METRICS //*the number of metrics used
    return {
      pickedUpOrders: pickedUp,
      deliveredOrders: delivered,
      renewedOrders: renewed,
      authorizedOrders: authorized,
      solvedReported: reportedSolved,
      unsolvedReported,
      payments: solvedOrdersPayments,
      expiredOrders,
      progress: {
        new: newOrders,
        reports,
        expired,
        total
      }
    }
  } catch (error) {
    console.log('error', error)
    return defaultCurrentWork
  }
  // setCurrentWork()
}
