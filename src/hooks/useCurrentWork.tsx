import { useState, useEffect } from 'react'
import { useOrdersCtx } from '../contexts/ordersContext'
import { useEmployee } from '../contexts/employeeContext'
import { useCurrentWorkCtx } from '../contexts/currentWorkContext'

const useCurrentWork = (initialValue: number = 0) => {
  const NUMBER_OF_METRICS = 3
  const {
    pickedUpOrders,
    authorizedOrders,
    deliveredOrders,
    renewedOrders,
    solvedReported,
    unsolvedReported
  } = useCurrentWorkCtx()
  const [progressNew, setProgressNew] = useState(initialValue)
  const [progressReports, setProgressReports] = useState(initialValue)
  const [progressExpired, setProgressExpired] = useState(initialValue)
  const [progressTotal, setTotal] = useState(initialValue)
  const { orders = [] } = useOrdersCtx()
  const pendingReports = orders?.filter((o) => o?.hasNotSolvedReports)
  const expired = orders?.filter((o) => o.isExpired)

  useEffect(() => {
    const total =
      (progressNew + progressReports + progressExpired) / NUMBER_OF_METRICS //*the number of metrics used
    setTotal(total)
  }, [progressNew, progressReports, progressExpired])

  console.log({
    solvedReported,
    pendingReports,
    authorizedOrders,
    pickedUpOrders,
    renewedOrders,
    deliveredOrders,
    unsolvedReported
  })
  useEffect(() => {
    setProgressReports(
      calculateProgress(solvedReported?.length, pendingReports?.length)
    )
    setProgressNew(
      calculateProgress(deliveredOrders?.length, authorizedOrders?.length)
    )

    setProgressExpired(
      calculateProgress(
        renewedOrders?.length + pickedUpOrders?.length,
        expired?.length
      )
    )
  }, [
    solvedReported,
    pendingReports,
    authorizedOrders,
    pickedUpOrders,
    renewedOrders,
    deliveredOrders
  ])

  return {
    progressTotal,
    progressNew,
    progressReports,
    progressExpired
  }
}

export default useCurrentWork
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
