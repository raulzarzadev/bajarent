import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect
} from 'react'
import OrderType from '../types/OrderType'
import { useOrdersCtx } from './ordersContext'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useStore } from './storeContext'
import { useEmployee } from './employeeContext'
import asDate, { endDate, startDate } from '../libs/utils-date'
import PaymentType from '../types/PaymentType'
import { ServicePayments } from '../firebase/ServicePayments'
import { isToday } from 'date-fns'

const CurrentWorkContext = createContext<CurrentWorks | undefined>(undefined)

export type CurrentWorks = {
  pickedUpOrders: Partial<OrderType>[]
  deliveredOrders: Partial<OrderType>[]
  renewedOrders: Partial<OrderType>[]
  authorizedOrders: Partial<OrderType>[]
  solvedReported: Partial<OrderType>[]
  unsolvedReported: Partial<OrderType>[]
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
  const [currentWork, setCurrentWork] = useState<CurrentWorks>({
    pickedUpOrders: [],
    deliveredOrders: [],
    renewedOrders: [],
    authorizedOrders: [],
    solvedReported: [],
    unsolvedReported: [],
    payments: [],
    progress: {
      new: 0,
      reports: 0,
      expired: 0,
      total: 0
    }
  })

  useEffect(() => {
    if (orders?.length && !employee.disabled) {
      handleSetData()
    }
  }, [orders])

  const handleSetData = () => {
    const expiredOrders = orders?.filter(
      (order) => order.expiresToday || order?.isExpired
    )

    const unsolvedReported = orders.filter((o) =>
      o.comments.find((c) => c.type === 'report' && !c.solved)
    )
    const solvedReported = orders.filter((o) =>
      o.comments.find(
        (c) => c.type === 'report' && c.solved && isToday(asDate(c.solvedAt))
      )
    )

    getCurrentWork({
      date,
      storeId,
      sectionsAssigned,
      solvedReported: solvedReported,
      unsolvedReported: unsolvedReported,
      expiredOrders
    }).then((data) => {
      setCurrentWork(data)
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
  solvedReported = [],
  unsolvedReported = [],
  expiredOrders = []
}: {
  storeId: string
  sectionsAssigned: string[]
  date: Date
  solvedReported: Partial<OrderType>[]
  unsolvedReported: Partial<OrderType>[]
  expiredOrders: Partial<OrderType>[]
}) => {
  const NUMBER_OF_METRICS = 3
  const pickedUpPromise = ServiceOrders.getPickedUp({
    storeId,
    sections: sectionsAssigned,
    fromDate: startDate(date),
    toDate: endDate(date)
  })
  const deliveredPromise = ServiceOrders.getDelivered({
    storeId,
    sections: sectionsAssigned,
    fromDate: startDate(date),
    toDate: endDate(date)
  })

  const renewedPromise = ServiceOrders.getRenewed({
    storeId,
    sections: sectionsAssigned,
    fromDate: startDate(date),
    toDate: endDate(date)
  })

  const authorizedPromise = ServiceOrders.getAuthorized({
    storeId,
    sections: sectionsAssigned
  })

  const [pickedUp, delivered, renewed, authorized] = await Promise.all([
    pickedUpPromise,
    deliveredPromise,
    renewedPromise,
    authorizedPromise
  ])

  const reports = calculateProgress(
    solvedReported?.length,
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

  const solvedExpiredPaymentsPromise = await ServicePayments.getBetweenDates({
    fromDate: startDate(date),
    toDate: endDate(date),
    storeId,
    inOrders: [...renewed.map(({ id }) => id), ...delivered.map(({ id }) => id)]
  })

  const total = (newOrders + reports + expired) / NUMBER_OF_METRICS //*the number of metrics used
  return {
    pickedUpOrders: pickedUp,
    deliveredOrders: delivered,
    renewedOrders: renewed,
    authorizedOrders: authorized,
    solvedReported,
    unsolvedReported,
    payments: solvedExpiredPaymentsPromise,
    progress: {
      new: newOrders,
      reports,
      expired,
      total
    }
  }
  // setCurrentWork()
}
