// src/types/bun-test.d.ts
declare module 'bun:test' {
  export function describe(name: string, fn: () => void): void
  export function it(name: string, fn: () => void | Promise<void>): void
  export function test(name: string, fn: () => void | Promise<void>): void
  export function beforeAll(fn: () => void | Promise<void>): void
  export function afterAll(fn: () => void | Promise<void>): void
  export function beforeEach(fn: () => void | Promise<void>): void
  export function afterEach(fn: () => void | Promise<void>): void
  export function mock(moduleName: string, factory?: () => any): jest.Mock
  export function spyOn(object: any, method: string): jest.SpyInstance

  export interface ExpectResult<T> {
    toBe(expected: T): void
    toEqual(expected: any): void
    toBeDefined(): void
    toBeUndefined(): void
    toBeNull(): void
    toBeTruthy(): void
    toBeFalsy(): void
    toBeGreaterThan(expected: number): void
    toBeGreaterThanOrEqual(expected: number): void
    toBeLessThan(expected: number): void
    toBeLessThanOrEqual(expected: number): void
    toContain(expected: any): void
    toHaveLength(expected: number): void
    toHaveProperty(property: string, value?: any): void
    toBeInstanceOf(expected: any): void
    toThrow(expected?: string | RegExp | Error): void
    toMatchObject(expected: any): void
    not: ExpectResult<T>
  }

  export function expect<T>(value: T): ExpectResult<T>
}
