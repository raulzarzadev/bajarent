// @ts-ignore
import { expect, test } from 'bun:test'

import { orders } from '../DATA'
import { groupDocsByMonth, groupDocsByType } from './chart-data'

// test('group orders by month', () => {
//   const result = groupDocsByMonth({ docs: orders })
//   Object.entries(result).forEach(([key, value]) => {
//     expect(key).toBeInstanceOf(String)
//     expect(value).toBeInstanceOf(Array)
//   })
// })

// test('group orders by type', () => {
//   const result = groupDocsByType({ docs: orders })
//   Object.entries(result).forEach(([key, value]) => {
//     expect(typeof key).toBe('string')
//     expect(value).toBeInstanceOf(Array)
//   })
// })
