import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/authContext'
import StaffType from '../types/StaffType'
import { ServiceStores } from '../firebase/ServiceStore'
import { ServiceStaff } from '../firebase/ServiceStaff'

function useUserStores() {
  const { user } = useAuth()

  const [userStores, setUserStores] = useState([])
  const [userPositions, setUserPositions] = useState<StaffType[]>([])

  useEffect(() => {
    //* *************** GET USER STORES AS OWNER *****************//
    if (user?.id) updateUserStores()
  }, [user?.id])

  useEffect(() => {
    //* *************** GET USER STORES AS STAFF *****************//
    if (user?.id) updatePositions()
  }, [user, userStores])

  const updateUserStores = () => {
    ServiceStores.getStoresByUserId(user?.id)
      .then((res) => {
        setUserStores(res)
      })
      .catch(console.error)
  }

  const updatePositions = () => {
    ServiceStaff.getStaffPositions(user?.id)
      .then(async (positions) => {
        const positionsWithStoreDataPromises = positions.map(
          async (position) => {
            const store = userStores?.find((s) => s?.id === position?.storeId)
            return {
              ...position,
              store: {
                name: store?.name,
                id: store?.id
              }
            }
          }
        )
        const positionsWithStore = await Promise.all(
          positionsWithStoreDataPromises
        )
        setUserPositions(positionsWithStore)
      })
      .catch(console.error)
  }

  return {
    stores: [...userStores, ...userPositions],
    userStores,
    userPositions
  }
}

export default useUserStores
