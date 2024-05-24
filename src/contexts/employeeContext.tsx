import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import StaffType from '../types/StaffType'
import { useAuth } from './authContext'
import { useStore } from './storeContext'

export type EmployeeContextType = {
  employee: Partial<StaffType> | null
  permissions: {
    isAdmin: boolean
    isOwner: boolean
    orders: StaffType['permissions']['order']
    store: StaffType['permissions']['store']
  }
}

const EmployeeContext = createContext<EmployeeContextType>({
  employee: null,
  permissions: { isAdmin: false, isOwner: false, orders: {}, store: {} }
})

let em = 0
export const EmployeeContextProvider = ({ children }) => {
  const { user } = useAuth()
  const { store, staff, storeSections } = useStore()

  const [employee, setEmployee] = useState<Partial<StaffType> | null>(null)
  const [assignedSections, setAssignedSections] = useState<string[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  useEffect(() => {
    setIsOwner(store && store?.createdBy === user?.id)
    const employee = staff?.find(
      ({ userId }) => user?.id && userId === user?.id
    )

    if (employee) {
      const sectionsAssigned = storeSections
        ?.filter(({ staff }) => staff?.includes(employee.id))
        .map(({ id }) => id)
      setIsAdmin(employee?.permissions?.isAdmin)
      setEmployee(employee)
      setAssignedSections(sectionsAssigned)
    } else {
      setEmployee(null)
      setIsAdmin(false)
    }
  }, [staff])

  const value = useMemo(
    () => ({
      employee: employee
        ? { ...employee, sectionsAssigned: assignedSections }
        : undefined,

      permissions: {
        isAdmin: !!isAdmin,
        isOwner: isOwner,
        orders: employee?.permissions?.order || {},
        store: employee?.permissions?.store || {}
      }
    }),
    [employee, isAdmin, isOwner, store, assignedSections]
  )

  em++
  console.log({ em })
  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  )
}

export const useEmployee = () => {
  return useContext(EmployeeContext)
}
