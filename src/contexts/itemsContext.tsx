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

export type Item = ItemType

interface ItemsContextProps {
  items?: Partial<ItemType>[] | null
  addItem: (item: Item) => void
  removeItem: (id: number) => void
}

const ItemsContext = createContext<ItemsContextProps | undefined>(undefined)

export const ItemsProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [items, setItems] = useState<Partial<ItemType>[]>(undefined)
  const { storeId } = useStore()
  const {
    permissions: {
      items: { canViewAllItems },
      isAdmin,
      isOwner
    }
  } = useEmployee()
  const getAllItems = isAdmin || isOwner || canViewAllItems
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

  const addItem = (item: Item) => {
    // setItems((prevItems) => [...prevItems, item])
  }

  const removeItem = (id: number) => {
    //setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  return (
    <ItemsContext.Provider value={{ items, addItem, removeItem }}>
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
