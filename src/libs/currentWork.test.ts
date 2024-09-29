//@ts-nocheck

import { calculateProgress } from './currentWork'

describe('calculateProgress', () => {
  it('should return 0 when no work is done', () => {
    const progress = calculateProgress(0, 100)
    expect(progress).toEqual(0)
  })

  it('should return 33 when 1/3  of the work is done', () => {
    const progress = calculateProgress(50, 100)
    expect(Math.round(33)).toEqual(33)
  })

  it('should return 50% when half work is done', () => {
    const progress = calculateProgress(100, 100)
    expect(progress).toEqual(50)
  })

  it('should return 0 when total work is 0', () => {
    const progress = calculateProgress(50, 0)
    expect(progress).toEqual(0)
  })

  it('should handle negative values gracefully', () => {
    const progress = calculateProgress(-10, 100)
    expect(progress).toEqual(0)
  })

  it('should return 60 when 150 of 250 of work is 0', () => {
    const progress = calculateProgress(150, 100)
    expect(progress).toEqual(60)
  })
})
