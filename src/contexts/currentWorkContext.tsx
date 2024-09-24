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
import { endDate, startDate } from '../libs/utils-date'
import PaymentType from '../types/PaymentType'

// interface CurrentWorkContextProps {
//   currentWork: CurrentWorks
// }

const CurrentWorkContext = createContext<CurrentWorks | undefined>(undefined)

export type CurrentWorks = {
  pickedUpOrders: Partial<OrderType>[]
  deliveredOrders: Partial<OrderType>[]
  renewedOrders: Partial<OrderType>[]
  authorizedOrders: Partial<OrderType>[]
  solvedReported: Partial<OrderType>[]
  unsolvedReported: Partial<OrderType>[]
  payments: Partial<PaymentType>[]
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
    payments: []
  })

  const handleSetCurrentWork = async () => {
    const pickedUpPromise = ServiceOrders.getPickedUp({
      storeId,
      sections: sectionsAssigned,
      fromDate: startDate(date),
      toDate: endDate(date)
    })

    const [pickedUp] = await Promise.all([pickedUpPromise])

    setCurrentWork({
      pickedUpOrders: pickedUp,
      deliveredOrders: [],
      renewedOrders: [],
      authorizedOrders: [],
      solvedReported: [],
      unsolvedReported: [],
      payments: []
    })
  }

  useEffect(() => {
    handleSetCurrentWork()
  }, [orders])

  return (
    <CurrentWorkContext.Provider value={{ ...currentWork }}>
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
