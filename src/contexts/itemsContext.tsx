import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react'
import ItemType from '../types/ItemType'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { useStore } from './storeContext'
import { useEmployee } from './employeeContext'
import { useAuth } from './authContext'

export type Item = ItemType

interface ItemsContextProps {
	items?: Partial<ItemType>[] | null
	workshopItems?: Partial<ItemType>[] | null
	addItem: (item: Item) => void
	removeItem: (id: number) => void
	workshopMovements?: unknown[]
	/**
	 * @deprecated use repair orders from ordersContext
	 */
	repairOrders?: unknown[]
}
let ic = 0
const ItemsContext = createContext<ItemsContextProps | undefined>(undefined)

export const ItemsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const { isAuthenticated, storeId } = useAuth()
	const { sections } = useStore()
	const [items, setItems] = useState<Partial<ItemType>[]>(undefined)
	const [workshopItems, setWorkshopItems] = useState<Partial<ItemType>[]>([])

	const {
		permissions: {
			items: { canViewAllItems },
			isAdmin,
			isOwner
		}
	} = useEmployee()

	const getAllItems = isAdmin || isOwner || canViewAllItems

	useEffect(() => {
		const storeWorkshops = sections?.filter(s => s.type === 'workshop')
		if (getAllItems) {
			ServiceStoreItems.listenAvailableBySections({
				storeId,
				userSections: storeWorkshops?.map(s => s?.id),
				cb: res => {
					setWorkshopItems(res)
				}
			})
		}
	}, [getAllItems])

	useEffect(() => {
		if (storeId && getAllItems && isAuthenticated)
			ServiceStoreItems.getAll({ storeId, justActive: true })
				.then(res => {
					setItems(res)
				})
				.catch(err => {
					console.error(err)
					setItems(null)
				})
	}, [storeId, getAllItems, isAuthenticated])

	const [workshopMovements, setWorkshopMovements] = useState<unknown[]>([])

	const addItem = (item: Item) => {
		// setItems((prevItems) => [...prevItems, item])
	}

	const removeItem = (id: number) => {
		//setItems((prevItems) => prevItems.filter((item) => item.id !== id))
	}
	ic++
	if (__DEV__) console.log({ ic })

	return (
		<ItemsContext.Provider
			value={{
				items,
				addItem,
				removeItem,
				workshopItems,
				workshopMovements
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
