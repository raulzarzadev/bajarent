import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import StaffType from '../types/StaffType'
import { useAuth } from './authContext'

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
  const [employee, setEmployee] = useState<Partial<StaffType> | null>(null)

  const [isAdmin, setIsAdmin] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const { user, store } = useAuth()

  useEffect(() => {
    const employee = store?.staff?.find(
      ({ userId }) =>
        (user?.id && userId === user?.id) || user?.id === store?.createdBy
    )
    const isOwner = store?.createdBy === user?.id
    setIsOwner(store?.createdBy === user?.id)

    if (employee) {
      //* set employee whit store sections where he is assigned
      const sectionsAssigned =
        store?.sections
          ?.filter(({ staff }) => staff?.includes(employee.id))
          .map(({ id }) => id) || []
      //* make sure that id is the id of staff not the user
      setEmployee({ ...employee, ...user, id: employee?.id, sectionsAssigned })
      setIsAdmin(employee?.permissions?.isAdmin)
    } else {
      setEmployee(null)
      setIsAdmin(false)
    }
  }, [user, store])

  const value = useMemo(
    () => ({
      employee,
      permissions: {
        isAdmin: !!isAdmin,
        isOwner: isOwner,
        orders: employee?.permissions?.order || {},
        store: employee?.permissions?.store || {}
      }
    }),
    [employee, isAdmin, isOwner, store]
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
