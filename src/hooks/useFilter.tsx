import { useEffect, useRef, useState } from 'react'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { formatOrders } from '../libs/orders'
import { useOrdersCtx } from '../contexts/ordersContext'
import OrderType from '../types/OrderType'
import { useEmployee } from '../contexts/employeeContext'
import { Filter, filterDataByFields, handleFilterUpdate, searchInLocalData } from './useFilterUtils'
import { ServiceCustomers } from '../firebase/ServiceCustomers'
import { useAuth } from '../contexts/authContext'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'

export type CollectionSearch = {
	collectionName: string
	fields?: string[]
	assignedSections?: 'all' | string[]
	debouncedSearch?: number
}

export default function useFilter<T extends { id?: string }>({
	data = [],
	collectionSearch,
	debounceSearch = 0
}: {
	data: T[]
	collectionSearch?: CollectionSearch
	debounceSearch?: number
}) {
	const { storeId } = useAuth()
	const { permissions } = useEmployee()
	const { reports } = useOrdersCtx()

	const [filteredData, setFilteredData] = useState<T[]>([...data])
	const [searchedData, setSearchedData] = useState<T[]>([])
	const [customData, setCustomData] = useState<T[]>([])
	const [filtersBy, setFiltersBy] = useState<Filter[]>([])
	const [searchValue, setSearchValue] = useState('')
	const [loading, setLoading] = useState(false)
	const [filteredBy, setFilteredBy] = useState<string | boolean | number>('status')

	const timeoutRef = useRef<number>()

	const filterBy = (field: string = 'status', value: string | boolean | number | string[]) => {
		const { filters, filteredData: newFilteredData } = handleFilterUpdate(
			filtersBy,
			field,
			value,

			searchedData?.length ? [...searchedData] : [...data]
		)

		setFiltersBy(filters)
		setFilteredData(newFilteredData)
	}

	const search = async (value: string) => {
		setSearchValue(value)

		if (!value) {
			setFilteredData(data)
			setSearchedData(data)
			setCustomData([])
			return
		}
		const { matchedData } = searchInLocalData(data, value, filtersBy)
		setFilteredData(matchedData)
		setSearchedData(matchedData)

		if (collectionSearch.collectionName === 'items') {
			console.log({ collectionSearch, value })
			ServiceStoreItems.search({
				storeId,
				fields: collectionSearch?.fields,
				value
			}).then(items => {
				console.log({ items })
				setCustomData(items as T[])
			})
		}

		if (collectionSearch?.collectionName === 'orders') {
			const collectionData = await ServiceOrders.search({
				storeId,
				fields: collectionSearch?.fields,
				value,
				sections: permissions.canViewAllOrders ? 'all' : collectionSearch?.assignedSections
			})
			const customers = await ServiceCustomers.listIds({
				ids: collectionData.map((o: OrderType) => o.customerId)
			})
			const formattedData = formatOrders({
				orders: collectionData,
				reports,
				customers
			})

			setCustomData([...(formattedData as T[])])
		}
	}

	const handleClearFilters = () => {
		setFilteredBy('')
		setFiltersBy([])
		setSearchValue('')
		setFilteredData([...data])
		setCustomData([])
		setSearchedData([])
	}

	useEffect(() => {
		if (searchValue) {
			search(searchValue)
		} else {
			const res = filterDataByFields(data, filtersBy)
			setFilteredData(res)
		}
	}, [data])

	const searchDebounced = async (value: string) => {
		setLoading(true)
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}
		timeoutRef.current = window.setTimeout(async () => {
			await search(value)
			setLoading(false)
		}, debounceSearch)
	}

	return {
		filteredData,
		customData,
		filteredBy,
		handleClearFilters,
		filterBy,
		search: searchDebounced,
		filtersBy,
		searchValue,
		loading
	}
}
