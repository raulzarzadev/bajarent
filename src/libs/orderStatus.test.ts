// @ts-expect-error
import { describe, expect, test } from 'bun:test'
import { subDays } from 'date-fns'
import { order_status, order_type, orders_should_expire } from '../types/OrderType'
import orderStatus from './orderStatus'

const lasWeek = subDays(new Date(), 7)
const yesterday = subDays(new Date(), 1)
const today = new Date()
const tomorrow = subDays(new Date(), -1)

describe('function should determinate order status  ', () => {
	test('order status is pending should return pending ', () => {
		const res = orderStatus({ status: order_status.PENDING })
		expect(res).toBe(order_status.PENDING)
	})

	test('order status is pickup should return pickup', () => {
		const res = orderStatus({ status: order_status.PICKUP })
		expect(res).toBe(order_status.PICKUP)
	})

	test('if rent order is expired should return expired', () => {
		const res = orderStatus({
			status: order_status.PENDING,
			type: order_type.RENT,
			expireAt: yesterday
		})
		expect(res).toBe(order_status.PENDING)
	})

	test('if any kind of rent order is delivered and expired should return expired', () => {
		Object.keys(orders_should_expire).forEach(type => {
			const rentOrder = orderStatus({
				type: orders_should_expire[type],
				status: order_status.DELIVERED,
				expireAt: yesterday,
				deliveredAt: lasWeek
			})
			expect(rentOrder).toBe(order_status.EXPIRED)
		})
	})

	test('if rent order status is delivered, and already expire and has pickup should return expired', () => {
		Object.keys(orders_should_expire).forEach(type => {
			const rentOrder = orderStatus({
				type: orders_should_expire[type],
				status: order_status.DELIVERED,
				expireAt: yesterday,
				deliveredAt: lasWeek,
				pickedUpAt: yesterday
			})
			expect(rentOrder).toBe(order_status.EXPIRED)
		})
	})

	test('if rent order is renewed should return renewed', () => {
		const res = orderStatus({
			status: order_status.RENEWED,
			type: order_type.RENT,
			expireAt: lasWeek,
			renewedAt: yesterday
		})
		expect(res).toBe(order_status.RENEWED)
	})
	test('if rent do not expires yet return delivery', () => {
		orders_should_expire.forEach(type => {
			const res = orderStatus({
				status: order_status.DELIVERED,
				type,
				expireAt: tomorrow,
				renewedAt: today
			})
			expect(res).toBe(order_status.DELIVERED)
		})
	})
	test('if rent is delivered but not expired date is set should return delivered but an also an error in console', () => {
		orders_should_expire.forEach(type => {
			const res = orderStatus({
				status: order_status.DELIVERED,
				type,
				expireAt: null,
				deliveredAt: today
			})
			expect(res).toBe(order_status.DELIVERED)
		})
	})
})
