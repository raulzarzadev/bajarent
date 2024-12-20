//@ts-nocheck
import { formatCurrentBalanceToProgress } from './formatCurrentBalanceToProgress'
describe('formatCurrentBalanceToProgress', () => {
  it('should return default structure when no data is provided', () => {
    const result = formatCurrentBalanceToProgress({
      currentBalance: 0,
      storeSections: []
    })
    expect(result).toEqual({
      bySections: {
        sectionId: {
          authorized: 0,
          delivered: 0,
          expired: 0,
          resolved: 0,
          reported: 0,
          reportedSolved: 0,
          payments: []
        }
      }
    })
  })

  it('should handle non-zero currentBalance', () => {
    const result = formatCurrentBalanceToProgress({
      currentBalance: 100,
      storeSections: []
    })
    expect(result).toEqual({
      bySections: {
        sectionId: {
          authorized: 0,
          delivered: 0,
          expired: 0,
          resolved: 0,
          reported: 0,
          reportedSolved: 0,
          payments: []
        }
      }
    })
  })

  it('should handle storeSections data', () => {
    const storeSections = [{ id: 'section1' }, { id: 'section2' }]
    const result = formatCurrentBalanceToProgress({
      currentBalance: 0,
      storeSections
    })
    expect(result).toEqual({
      bySections: {
        sectionId: {
          authorized: 0,
          delivered: 0,
          expired: 0,
          resolved: 0,
          reported: 0,
          reportedSolved: 0,
          payments: []
        }
      }
    })
  })
})
