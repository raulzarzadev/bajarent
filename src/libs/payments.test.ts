import { payment_methods } from '../types/PaymentType'
import { expect, describe, it } from 'bun:test'
import { Payments, payments_amount, PaymentsAmount } from './paymentsUtils'

describe('payments_amount', () => {
	it('When are no payments should be 0', () => {
		const payments: Payments = []

		const expected = {
			total: 0,
			cash: 0,
			card: 0,
			transfers: 0,
			canceled: 0,
			transfersNotVerified: 0,
			retirements: 0,
			incomes: 0,
			outcomes: 0,
			bonus: 0,
			expense: 0,
			missing: 0
		}

		const result = payments_amount(payments)

		expect(result).toEqual(expected)
	})

	it('sum CANCELED PAYMENTS', () => {
		const payments: Payments = [
			{ amount: 10, method: payment_methods.CASH, canceled: true },
			{ amount: 20, method: payment_methods.CARD, canceled: true },
			{ amount: 30, method: payment_methods.TRANSFER, canceled: true }
		]

		const expected = {
			total: 0,
			cash: 0,
			card: 0,
			transfers: 0,
			canceled: 60,
			transfersNotVerified: 0,
			retirements: 0,
			incomes: 0,
			outcomes: 0,
			bonus: 0,
			expense: 0,
			missing: 0
		}

		const result = payments_amount(payments)

		expect(result).toEqual(expected)
	})

	it('NO VERIFIED TRANSFERS', () => {
		const payments: Payments = [
			{ amount: 10, method: payment_methods.CASH },
			{ amount: 20, method: payment_methods.CARD },
			{
				amount: 30,
				method: payment_methods.TRANSFER,
				verified: false
			}
		]

		const expected = {
			total: 60,
			cash: 10,
			card: 20,
			transfers: 30,
			canceled: 0,
			transfersNotVerified: 30,
			retirements: 0,
			incomes: 60,
			outcomes: 0,
			bonus: 0,
			expense: 0,
			missing: 0
		}

		const result = payments_amount(payments)

		expect(result).toEqual(expected)
	})
	it('RETIREMENTS ', () => {
		const payments: Payments = [
			{
				amount: 10,
				method: payment_methods.CASH,
				isRetirement: true
			},
			{
				amount: 20,
				method: payment_methods.CASH,
				isRetirement: true
			},
			{
				amount: 30,
				method: payment_methods.CASH
			}
		]

		const expected = {
			total: 0,
			cash: 0,
			card: 0,
			transfers: 0,
			canceled: 0,
			transfersNotVerified: 0,
			retirements: 30,
			incomes: 30,
			outcomes: 30,
			bonus: 0,
			expense: 0,
			missing: 0
		}

		const result = payments_amount(payments)

		expect(result).toEqual(expected)
	})
	it('RETIREMENTS WITH ALTERNATIVE METHOD', () => {
		const payments: Payments = [
			{
				amount: 10,
				method: payment_methods.CASH,
				isRetirement: true
			},
			{
				amount: 20,
				method: payment_methods.CASH,
				isRetirement: true
			},
			{
				amount: 30,
				method: payment_methods.TRANSFER
			}
		]

		const expected = {
			total: 0,
			cash: -30,
			card: 0,
			transfers: 30,
			canceled: 0,
			transfersNotVerified: 30,
			retirements: 30,
			incomes: 30,
			outcomes: 30,
			bonus: 0,
			expense: 0,
			missing: 0
		}

		const result = payments_amount(payments)

		expect(result).toEqual(expected)
	})
	it('MISSING AMOUNTS', () => {
		const payments: Payments = [
			{
				amount: 50,
				method: payment_methods.CASH
			},
			{
				amount: 50,
				method: payment_methods.CASH
			},

			{
				amount: 20,
				method: 'cash',
				isRetirement: true,
				type: 'missing'
			},
			{
				amount: 20,
				method: 'cash',
				isRetirement: true,
				type: 'missing'
			}
		]

		const expected: PaymentsAmount = {
			total: 60,
			cash: 60, // 50 + 50 - 20 - 20
			card: 0,
			transfers: 0,
			canceled: 0,
			transfersNotVerified: 0,
			retirements: 40, // 20 + 20
			incomes: 100, // 50 + 50
			outcomes: 40, // 20 + 20
			bonus: 0,
			expense: 0,
			missing: 40 // 20 + 20
		}

		const result = payments_amount(payments)

		expect(result).toEqual(expected)
	})
	it('OUTCOMES AMOUNTS', () => {
		const payments: Payments = [
			{
				amount: 50,
				method: payment_methods.CASH
			},
			{
				amount: 50,
				method: payment_methods.CASH
			},

			{
				amount: 10,
				method: 'cash',
				isRetirement: true,
				type: 'expense'
			},
			{
				amount: 10,
				method: 'cash',
				isRetirement: true,
				type: 'expense'
			},
			{
				amount: 20,
				method: 'cash',
				isRetirement: true,
				type: 'missing'
			}
		]

		const expected: PaymentsAmount = {
			total: 60,
			cash: 60, // 50 + 50 - 20 - 20
			card: 0,
			transfers: 0,
			canceled: 0,
			transfersNotVerified: 0,
			retirements: 40, // 20 + 20
			incomes: 100, // 50 + 50
			outcomes: 40, // 20 + 20
			bonus: 0,
			expense: 20, // 20
			missing: 20 // 20
		}

		const result = payments_amount(payments)

		expect(result).toEqual(expected)
	})
	it('BONUS AMOUNTS', () => {
		const payments: Payments = [
			{
				amount: 50,
				method: payment_methods.CASH
			},
			{
				amount: 50,
				method: payment_methods.CASH
			},

			{
				amount: 20,
				method: 'cash',
				isRetirement: true,
				type: 'bonus'
			},
			{
				amount: 10,
				method: 'cash',
				isRetirement: true,
				type: 'bonus'
			},
			{
				amount: 20,
				method: 'cash',
				isRetirement: true,
				type: 'bonus'
			}
		]

		const expected: PaymentsAmount = {
			total: 50,
			cash: 50, // 50 + 50 - 20 - 10 - 20
			card: 0,
			transfers: 0,
			canceled: 0,
			transfersNotVerified: 0,
			retirements: 50, // 20 + 10 + 20
			incomes: 100, // 50 + 50
			outcomes: 50, // 20 + 10 + 20
			bonus: 50, // 20 + 10 + 20
			expense: 0,
			missing: 0
		}

		const result = payments_amount(payments)

		expect(result).toEqual(expected)
	})
})
