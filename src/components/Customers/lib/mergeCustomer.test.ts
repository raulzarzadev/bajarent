//@ts-nocheck
import type { CustomerType } from '../../../state/features/costumers/customerType'
import { mergeCustomers } from './customerFromOrder'

describe('mergeCustomers', () => {
	it('should merge two customers with different properties', () => {
		const customer1: Partial<CustomerType> = {
			id: '1',
			name: 'John Doe',
			contacts: {
				'12A': {
					value: '+523333333333',
					type: 'phone',
					isFavorite: false,
					id: '12A',
					label: 'Contacto 1',
					deletedAt: null
				},
				'12A2': {
					value: '+524444444444',
					type: 'phone',
					isFavorite: false,
					id: '12A',
					label: 'Contacto 1',
					deletedAt: null
				}
			},
			images: {
				'12B': {
					src: 'john1.jpg',
					description: 'Casa',
					type: 'house',
					id: '12B'
				}
			}
		}

		const customer2: Partial<CustomerType> = {
			id: '2',
			name: 'Jane Smith',
			contacts: {
				'12ADS': {
					value: '+524444444444',
					type: 'phone',
					isFavorite: false,
					id: '12ADS',
					label: 'mama',
					deletedAt: null
				}
			},
			images: {
				'12BCD': {
					src: 'john2.jpg',
					description: 'Casa',
					type: 'house',
					id: '12BCD'
				},
				'12BCD2': {
					src: 'john1.jpg',
					description: 'Casa',
					type: 'house',
					id: '12BCD2'
				}
			}
		}

		const result = mergeCustomers(customer1, customer2)

		expect(result.id).toBe('1')
		expect(result.name).toBe('John Doe, Jane Smith')
		expect(result.contacts).toEqual({
			'12A2': {
				value: '+524444444444',
				type: 'phone',
				isFavorite: false,
				id: '12A',
				label: 'Contacto 1',
				deletedAt: null
			},
			'12A': {
				value: '+523333333333',
				type: 'phone',
				isFavorite: false,
				id: '12A',
				label: 'Contacto 1',
				deletedAt: null
			}
		})

		expect(result.images).toEqual({
			'12BCD': {
				src: 'john2.jpg',
				description: 'Casa',
				type: 'house',
				id: '12BCD'
			},
			'12B': {
				src: 'john1.jpg',
				description: 'Casa',
				type: 'house',
				id: '12B'
			}
		})
	})

	// it('should normalize the customer name', () => {
	//   const customer1: Partial<CustomerType> = {
	//     name: 'john   doe'
	//   }

	//   const customer2: Partial<CustomerType> = {
	//     name: 'jane smith'
	//   }

	//   const result = mergeCustomers(customer1, customer2)

	//   expect(result.name).toBe('Jane Smith')
	// })

	// it('should handle empty customer objects', () => {
	//   const customer1: Partial<CustomerType> = {}
	//   const customer2: Partial<CustomerType> = {}

	//   const result = mergeCustomers(customer1, customer2)

	//   expect(result).toEqual({
	//     id: undefined,
	//     name: '',
	//     contacts: {},
	//     contactsList: [],
	//     images: {}
	//   })
	// })

	// it('should prioritize customer2 properties over customer1', () => {
	//   const customer1: Partial<CustomerType> = {
	//     id: '1',
	//     name: 'John Doe',
	//     contacts: { email: 'john@example.com' },
	//     contactsList: ['john@example.com'],
	//     images: { profile: 'john.jpg' }
	//   }

	//   const customer2: Partial<CustomerType> = {
	//     id: '2',
	//     name: 'Jane Smith',
	//     contacts: { email: 'jane@example.com' },
	//     contactsList: ['jane@example.com'],
	//     images: { profile: 'jane.jpg' }
	//   }

	//   const result = mergeCustomers(customer1, customer2)

	//   expect(result.id).toBe('2')
	//   expect(result.name).toBe('Jane Smith')
	//   expect(result.contacts).toEqual({
	//     email: 'jane@example.com'
	//   })
	//   expect(result.contactsList).toEqual([
	//     'jane@example.com',
	//     'john@example.com'
	//   ])
	//   expect(result.images).toEqual({
	//     profile: 'jane.jpg'
	//   })
	// })
})
