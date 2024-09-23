import { useState, useEffect } from 'react'
import { useOrdersCtx } from '../contexts/ordersContext'
import { useEmployee } from '../contexts/employeeContext'

const useProgressWork = (initialValue: number = 0) => {
  const { todayWork } = useEmployee()
  const [progressNew, setProgressNew] = useState(initialValue)
  const [progressReports, setProgressReports] = useState(initialValue)
  const [progressExpired, setProgressExpired] = useState(initialValue)
  const [progressTotal, setTotal] = useState(initialValue)

  const { orders = [] } = useOrdersCtx()
  const pendingReports = orders?.filter((o) => o?.hasNotSolvedReports)

  const { pickedUp, delivered, renewed, payments, resolvedReports } =
    todayWork || {}

  useEffect(() => {
    const total = progressNew + progressReports + progressExpired //* /3 the number of metrics used
    setTotal(total)
  }, [progressNew, progressReports, progressExpired])

  useEffect(() => {
    setProgressReports(
      calculateProgress(resolvedReports?.length, pendingReports?.length)
    )
    // setProgressNew(calculateProgress(pickedUp?.length, pendingReports?.length))
  }, [resolvedReports, pendingReports])

  return {
    progressTotal,
    progressNew,
    progressReports,
    progressExpired
  }
}

export default useProgressWork
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
