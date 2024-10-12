import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect
} from 'react'
import ItemType from '../types/ItemType'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { useStore } from './storeContext'
import { useEmployee } from './employeeContext'
import { ServiceOrders } from '../firebase/ServiceOrders'

export type Item = ItemType

interface ItemsContextProps {
  items?: Partial<ItemType>[] | null
  workshopItems?: Partial<ItemType>[] | null
  addItem: (item: Item) => void
  removeItem: (id: number) => void
  workshopMovements?: unknown[]
  repairOrders?: unknown[]
}

const ItemsContext = createContext<ItemsContextProps | undefined>(undefined)

export const ItemsProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [items, setItems] = useState<Partial<ItemType>[]>(undefined)
  const [workshopItems, setWorkshopItems] = useState<Partial<ItemType>[]>([])
  const { storeId } = useStore()
  const [repairOrders, setRepairOrders] = useState<unknown[]>([])

  const {
    permissions: {
      items: { canViewAllItems },
      isAdmin,
      isOwner
    },
    employee
  } = useEmployee()

  const getAllItems = isAdmin || isOwner || canViewAllItems

  useEffect(() => {
    if (employee?.rol === 'technician') {
      ServiceStoreItems.listenAvailableBySections({
        storeId,
        userSections: ['workshop'],
        cb: (res) => {
          setWorkshopItems(res)
        }
      })
    }
  }, [employee?.rol])

  useEffect(() => {
    if (storeId && getAllItems)
      ServiceStoreItems.getAll({ storeId, justActive: true })
        .then((res) => {
          setItems(res)
        })
        .catch((err) => {
          console.error(err)
          setItems(null)
        })
  }, [storeId, getAllItems])

  useEffect(() => {
    if (storeId) {
      ServiceOrders.listenRepairUnsolved({ storeId, cb: setRepairOrders })
    }
  }, [storeId])

  const [workshopMovements, setWorkshopMovements] = useState<unknown[]>([])

  const addItem = (item: Item) => {
    // setItems((prevItems) => [...prevItems, item])
  }

  const removeItem = (id: number) => {
    //setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  return (
    <ItemsContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        workshopItems,
        workshopMovements,
        repairOrders
      }}
    >
      {children}
    </ItemsContext.Provider>
  )
}

export const useItemsCtx = (): ItemsContextProps => {
  const context = useContext(ItemsContext)
  if (!context) {
    throw new Error('useItems must be used within an ItemsProvider')
  }
  return context
}
