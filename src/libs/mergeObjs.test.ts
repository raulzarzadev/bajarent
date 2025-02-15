import { mergeObjs } from './mergeObjs'

describe('mergeObjs', () => {
  it('should merge flat objects', () => {
    const obj1 = { a: 1, b: 2 }
    const changes = { b: 3, c: 4 }
    const result = mergeObjs(obj1, changes)
    expect(result).toEqual({ a: 1, b: 3, c: 4 })
  })

  it('should merge nested objects', () => {
    const obj1 = { a: { b: 2 } }
    const changes = { 'a.b': 3, 'a.c': 4 }
    const result = mergeObjs(obj1, changes)
    expect(result).toEqual({ a: { b: 3, c: 4 } })
  })

  it('should handle deep nested objects', () => {
    const obj1 = { a: { b: { c: 2 } } }
    const changes = { 'a.b.c': 3, 'a.b.d': 4 }
    const result = mergeObjs(obj1, changes)
    expect(result).toEqual({ a: { b: { c: 3, d: 4 } } })
  })

  it('should merge arrays', () => {
    const obj1 = { a: [1, 2, 3] }
    const changes = { a: [4, 5] }
    const result = mergeObjs(obj1, changes)
    expect(result).toEqual({ a: [4, 5] })
  })

  it('should add new properties', () => {
    const obj1 = { a: 1 }
    const changes = { b: 2 }
    const result = mergeObjs(obj1, changes)
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('should overwrite existing properties', () => {
    const obj1 = { a: 1, b: 2 }
    const changes = { b: 3 }
    const result = mergeObjs(obj1, changes)
    expect(result).toEqual({ a: 1, b: 3 })
  })

  it('should handle empty changes', () => {
    const obj1 = { a: 1, b: 2 }
    const changes = {}
    const result = mergeObjs(obj1, changes)
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('should handle empty initial object', () => {
    const obj1 = {}
    const changes = { a: 1, b: 2 }
    const result = mergeObjs(obj1, changes)
    expect(result).toEqual({ a: 1, b: 2 })
  })
})
