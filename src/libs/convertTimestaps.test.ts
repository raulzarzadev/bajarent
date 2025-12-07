//@ts-nocheck
import { Timestamp } from 'firebase/firestore'
import { convertTimestamps } from './utils-date'

describe('convertTimestamps', () => {
	const createTimestamp = (date: Date): Timestamp => Timestamp.fromDate(new Date(date))
	it('should convert a single timestamp to a date string', () => {
		const timestamp = createTimestamp(new Date('2021-10-01'))
		const result = convertTimestamps(timestamp, { to: 'string' })
		expect(result).toEqual('2021-10-01T00:00:00.000Z')
	})
	it('should convert a object with a timestamp to a object with a date string', () => {
		const timestamp = createTimestamp(new Date('2021-10-01'))
		const obj = { createdAt: timestamp }
		const result = convertTimestamps(obj, { to: 'string' })
		expect(result).toEqual({ createdAt: '2021-10-01T00:00:00.000Z' })
	})
	it('should convert a object with a timestamp to a object with a date string', () => {
		const timestamp = createTimestamp(new Date('2021-10-01'))
		const obj = { ['time.createAt']: timestamp }
		const result = convertTimestamps(obj, { to: 'string' })
		expect(result).toEqual({
			time: {
				createAt: '2021-10-01T00:00:00.000Z'
			}
		})
	})
	it('should convert a array of objects with a timestamp to a object with a date', () => {
		const timestamp = createTimestamp(new Date('2021-10-01'))
		const array = [{ createdAt: timestamp }]
		const result = convertTimestamps(array, { to: 'date' })
		expect(result).toEqual([{ createdAt: new Date('2021-10-01') }])
	})
	it('should convert a nested object of objects with a timestamp to a object with a date', () => {
		const timestamp = createTimestamp(new Date('2021-10-01'))
		const array = { obj: { createdAt: timestamp } }
		const result = convertTimestamps(array, { to: 'date' })
		expect(result).toEqual({ obj: { createdAt: new Date('2021-10-01') } })
	})
	it('should convert a nested array of objects with a timestamp to a object with a date', () => {
		const timestamp = createTimestamp(new Date('2021-10-01'))
		const array = [{ obj: { createdAt: timestamp } }]
		const result = convertTimestamps(array, { to: 'date' })
		expect(result).toEqual([{ obj: { createdAt: new Date('2021-10-01') } }])
	})
	it('should convert a nested array of nested objects with a timestamp to a object with a date', () => {
		const timestamp = createTimestamp(new Date('2021-10-01'))
		const array = [
			[
				{
					obj: {
						createdAt: timestamp,
						moreOps: {
							createdAt: new Date('2021-10-01')
						}
					}
				}
			]
		]
		const result = convertTimestamps(array, { to: 'date' })
		expect(result).toEqual([
			[
				{
					obj: {
						createdAt: new Date('2021-10-01'),
						moreOps: {
							createdAt: new Date('2021-10-01')
						}
					}
				}
			]
		])
	})
})
