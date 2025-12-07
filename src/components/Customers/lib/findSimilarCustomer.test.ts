//@ts-nocheck
import { CustomerType } from '../../../state/features/costumers/customerType'
import { findSimilarCustomer } from './customerFromOrder'

describe('findSimilarCustomer', () => {
	const customers: Partial<CustomerType>[] = [
		{
			id: '1',
			name: 'John Doe',
			contacts: {
				'1': { label: 'Home', value: '123-456-7890', type: 'phone', id: '1' },
				'2': { label: 'Work', value: '987-654-3210', type: 'phone', id: '2' }
			}
		},
		{
			id: '2',
			name: 'Jane Smith',
			contacts: {
				'3': { label: 'Mobile', value: '555-555-5555', type: 'phone', id: '3' },
				'4': { label: 'Home', value: '123-456-7890', type: 'phone', id: '4' }
			}
		},
		{
			id: '3',
			name: 'Alice Johnson',
			contacts: {
				'5': { label: 'Home', value: '111-111-1111', type: 'phone', id: '5' },
				'6': { label: 'Work', value: '222-222-2222', type: 'phone', id: '6' }
			}
		}
	]

	it('should return A customer if a customer with a matching phone number is found', () => {
		const newCustomer: Partial<CustomerType> = {
			id: '4',
			name: 'Bob Brown',
			contacts: {
				'7': { label: 'Mobile', value: '123-456-7890', type: 'phone', id: '7' }
			}
		}
		const shouldFind = customers.find(c => c.id === '1')
		const result = findSimilarCustomer(newCustomer, customers)
		expect(result).toEqual(shouldFind)
	})

	it('should return null if no customer with a matching phone number is found', () => {
		const newCustomer: Partial<CustomerType> = {
			id: '4',
			name: 'Bob Brown',
			contacts: {
				'7': { label: 'Mobile', value: '333-333-3333', type: 'phone', id: '7' }
			}
		}
		const shouldFind = null
		const result = findSimilarCustomer(newCustomer, customers)
		expect(result).toEqual(shouldFind)
	})

	it('should return a customer if multiple phone numbers match', () => {
		const shouldFind = customers.find(c => c.id === '1')
		const newCustomer: Partial<CustomerType> = {
			id: '4',
			name: 'Bob Brown',
			contacts: {
				'7': { label: 'Mobile', value: '123-456-7890', type: 'phone', id: '7' },
				'8': { label: 'Home', value: '987-654-3210', type: 'phone', id: '8' }
			}
		}
		const result = findSimilarCustomer(newCustomer, customers)
		expect(result).toEqual(shouldFind)
	})

	it('should return null if the new customer has no phone numbers', () => {
		const newCustomer: Partial<CustomerType> = {
			id: '4',
			name: 'Bob Brown',
			contacts: {}
		}
		const shouldFind = null
		const result = findSimilarCustomer(newCustomer, customers)
		expect(result).toEqual(shouldFind)
	})

	it('should return false if the customer list is empty', () => {
		const newCustomer: Partial<CustomerType> = {
			id: '4',
			name: 'Bob Brown',
			contacts: {
				'7': { label: 'Mobile', value: '123-456-7890', type: 'phone', id: '7' }
			}
		}
		const shouldFind = null
		const result = findSimilarCustomer(newCustomer, [])
		expect(result).toEqual(shouldFind)
	})
})
