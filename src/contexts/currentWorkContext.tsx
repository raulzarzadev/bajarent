import React, {
  createContext,
  useState,
  useContext,
  ReactNode
  //useEffect
} from 'react'
import OrderType from // order_status,
// TypeOrder,
// TypeOrderType
'../types/OrderType'
// import { useOrdersCtx } from './ordersContext'
// import { ServiceOrders } from '../firebase/ServiceOrders'
// import { useStore } from './storeContext'
// import { useEmployee } from './employeeContext'
// import { endDate, startDate } from '../libs/utils-date'
import PaymentType from '../types/PaymentType'
// import { ServicePayments } from '../firebase/ServicePayments'
// import { where } from 'firebase/firestore'
// import { ServiceComments } from '../firebase/ServiceComments'
// import { calculateProgress } from '../libs/currentWork'
// import { ServiceCurrentWork } from '../firebase/ServiceCurrentWork'
export type CurrentWorkContextType = {
  currentWork?: CurrentWorks
  setDate: (date: Date) => void
}
const CurrentWorkContext = createContext<CurrentWorkContextType>(undefined)
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
  //const { storeId } = useStore()
  //const { employee, permissions } = useEmployee()

  // const sectionsAssigned = employee?.sectionsAssigned || []

  //const { orders } = useOrdersCtx()
  const [currentWork, setCurrentWork] = useState<CurrentWorks>()
  // useEffect(() => {
  //   if (orders) {
  //     handleSetData({
  //       disabledEmployee: employee?.disabled,
  //       allowGetInfoFromAllOrders:
  //         permissions.isAdmin ||
  //         permissions.isOwner ||
  //         permissions?.store?.canSeeCurrentWork,
  //       sectionsAssigned
  //     })
  //   }
  // }, [orders, employee?.disabled, sectionsAssigned])

  // useEffect(() => {
  //   if (storeId)
  //     ServiceCurrentWork.getBetweenDates({
  //       storeId,
  //       fromDate: startDate(date),
  //       toDate: endDate(date)
  //     }).then((data: CurrentWorks[]) => {
  //       setCurrentWork(data?.[0])
  //     })
  // }, [date, storeId])

  // const handleSetData = ({
  //   disabledEmployee = false,
  //   allowGetInfoFromAllOrders = false,
  //   sectionsAssigned
  // }) => {
  //   if (disabledEmployee) {
  //     return setCurrentWork(defaultCurrentWork)
  //   }
  //   if (allowGetInfoFromAllOrders) {
  //     getCurrentWork({
  //       date,
  //       storeId,
  //       sectionsAssigned,
  //       orderType: TypeOrder.RENT,
  //       currentOrders: orders
  //     }).then((data) => {
  //       setCurrentWork({ ...data })
  //     })
  //     return
  //   }
  //   if (employee.sectionsAssigned.length > 0) {
  //     getCurrentWork({
  //       date,
  //       storeId,
  //       sectionsAssigned,
  //       orderType: TypeOrder.RENT,
  //       currentOrders: orders
  //     }).then((data) => {
  //       setCurrentWork({ ...data })
  //     })
  //     return
  //   }
  // }

  return (
    <CurrentWorkContext.Provider value={{ currentWork, setDate }}>
      {children}
    </CurrentWorkContext.Provider>
  )
}

export const useCurrentWorkCtx = (): CurrentWorkContextType => {
  const context = useContext(CurrentWorkContext)
  if (!context) {
    throw new Error('useCurrentWork must be used within a CurrentWorkProvider')
  }
  return context
}

// const getCurrentWork = async ({
//   storeId = '',
//   sectionsAssigned = [],
//   date = new Date(),
//   orderType,
//   currentOrders = []
// }: {
//   storeId: string
//   sectionsAssigned: string[]
//   date: Date
//   orderType?: TypeOrderType
//   currentOrders: Partial<OrderType>[]
// }) => {
//   // if sectionsAssigned.length is 0, should will get info of all orders
//   try {
//     const pickedUpPromise = ServiceOrders.getPickedUp({
//       storeId,
//       sections: sectionsAssigned,
//       fromDate: startDate(date),
//       toDate: endDate(date),
//       orderType
//     })
//     const deliveredPromise = ServiceOrders.getDelivered({
//       storeId,
//       sections: sectionsAssigned,
//       fromDate: startDate(date),
//       toDate: endDate(date),
//       orderType
//     })

//     const renewedPromise = ServiceOrders.getRenewed({
//       storeId,
//       sections: sectionsAssigned,
//       fromDate: startDate(date),
//       toDate: endDate(date),
//       orderType
//     })

//     const reportedOrderPromises = ServiceComments.getSolvedReportsByDate({
//       storeId,
//       fromDate: startDate(new Date()),
//       toDate: endDate(new Date())
//     })
//       .then((reports) => {
//         const ordersIds = Array.from(new Set(reports.map((r) => r.orderId)))
//         return ordersIds.map((orderId) => ServiceOrders.get(orderId))
//       })
//       .then((ordersPromises) => {
//         return Promise.all(ordersPromises)
//       })

//     const [pickedUp, delivered, renewed, reportedSolved] = await Promise.all([
//       pickedUpPromise,
//       deliveredPromise,
//       renewedPromise,
//       reportedOrderPromises
//     ])

//     const authorized = currentOrders
//       .filter((o) => o.type === orderType)
//       .filter((o) => o.status === order_status.AUTHORIZED)

//     const unsolvedReportedInSectionAssigned = currentOrders
//       .filter((o) => o.type === orderType)
//       .filter((o) => o.hasNotSolvedReports)

//     const solvedOrders = [...renewed, ...delivered].filter((o) => {
//       return sectionsAssigned.length > 0
//         ? sectionsAssigned.includes(o.assignToSection)
//         : true
//     })
//     const solvedReportsInSectionAssigned = reportedSolved.filter((o) =>
//       sectionsAssigned.length > 0
//         ? sectionsAssigned.includes(o.assignToSection)
//         : true
//     )

//     const paidOrders = await ServicePayments.getInList({
//       list: solvedOrders.map(({ id }) => id),
//       field: 'orderId',
//       moreFilters: [
//         where('createdAt', '>=', startDate(date)),
//         where('createdAt', '<=', endDate(date))
//       ]
//     })

//     const reportedProgress = calculateProgress(
//       solvedReportsInSectionAssigned?.length,
//       unsolvedReportedInSectionAssigned?.length
//     )

//     const deliveredProgress = calculateProgress(
//       delivered?.length,
//       authorized?.length
//     )

//     const expiredOrders = currentOrders.filter(
//       (o) => o.expiresToday || o.isExpired
//     )

//     const expiredProgress = calculateProgress(
//       renewed?.length + pickedUp?.length,
//       expiredOrders?.length
//     )

//     const doneOrders =
//       delivered?.length +
//       renewed?.length +
//       pickedUp?.length +
//       solvedReportsInSectionAssigned?.length

//     const pendingOrders =
//       authorized?.length +
//       expiredOrders?.length +
//       unsolvedReportedInSectionAssigned?.length

//     const total = calculateProgress(doneOrders, pendingOrders)

//     return {
//       pickedUpOrders: pickedUp,
//       deliveredOrders: delivered,
//       renewedOrders: renewed,
//       authorizedOrders: authorized,
//       solvedReported: solvedReportsInSectionAssigned,
//       unsolvedReported: unsolvedReportedInSectionAssigned,
//       payments: paidOrders,
//       expiredOrders,
//       sections: sectionsAssigned,
//       progress: {
//         new: deliveredProgress,
//         reports: reportedProgress,
//         expired: expiredProgress,
//         total
//       }
//     }
//   } catch (error) {
//     console.log('error', error)
//     return defaultCurrentWork
//   }
//   // setCurrentWork()
// }
