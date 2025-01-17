//@ts-nocheck

import { versionCompare } from './versionCompare'

describe('versionCompare', () => {
  it('should return 0 when versions are equal', () => {
    expect(versionCompare('1.0.0', '1.0.0')).toEqual(0)
    expect(versionCompare('2.3.4', '2.3.4')).toEqual(0)
    expect(versionCompare('0.0.1', '0.0.1')).toEqual(0)
  })

  it('should return 1 when the first version is greater', () => {
    expect(versionCompare('1.0.1', '1.0.0')).toEqual(1)
    expect(versionCompare('2.3.5', '2.3.4')).toEqual(1)
    expect(versionCompare('0.1.0', '0.0.9')).toEqual(1)
  })

  it('should return 2 when the second version is greater', () => {
    expect(versionCompare('1.0.0', '1.0.1')).toEqual(2)
    expect(versionCompare('2.3.4', '2.3.5')).toEqual(2)
    expect(versionCompare('0.0.9', '0.1.0')).toEqual(2)
  })

  it('should return 3 when versions do not match in length', () => {
    expect(versionCompare('1.0', '1.0.0')).toEqual(3)
    expect(versionCompare('2.3.4', '2.3')).toEqual(3)
    expect(versionCompare('0.0.1', '0.0')).toEqual(3)
  })
})
