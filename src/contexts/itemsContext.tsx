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

export type Item = ItemType

interface ItemsContextProps {
  items: Item[]
  addItem: (item: Item) => void
  removeItem: (id: number) => void
}

const ItemsContext = createContext<ItemsContextProps | undefined>(undefined)

export const ItemsProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [items, setItems] = useState<Item[]>([])
  const { storeId } = useStore()
  useEffect(() => {
    ServiceStoreItems.getAll({ storeId, justActive: true }).then((res) => {
      setItems(res)
    })
  }, [])

  const addItem = (item: Item) => {
    // setItems((prevItems) => [...prevItems, item])
  }

  const removeItem = (id: number) => {
    //setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }
  console.log({ items })

  return (
    <ItemsContext.Provider value={{ items, addItem, removeItem }}>
      {children}
    </ItemsContext.Provider>
  )
}

export const useItems = (): ItemsContextProps => {
  const context = useContext(ItemsContext)
  if (!context) {
    throw new Error('useItems must be used within an ItemsProvider')
  }
  return context
}
