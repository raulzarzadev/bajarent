type Primitive = string | number | boolean | null | undefined | symbol | bigint

type ReplaceUndefinedWithNull<T> = T extends undefined
  ? null
  : T extends Primitive
  ? Exclude<T, undefined>
  : T extends Date
  ? Date
  : T extends Array<infer U>
  ? Array<ReplaceUndefinedWithNull<U>>
  : T extends object
  ? { [K in keyof T]: ReplaceUndefinedWithNull<T[K]> }
  : T

type FirebaseSafeSaveParams<T extends Record<string, unknown>, R> = {
  data: T
  saveFn: (payload: ReplaceUndefinedWithNull<T>) => Promise<R>
  contextLabel?: string
}

type SanitizerResult<T> = {
  sanitized: ReplaceUndefinedWithNull<T>
  mutatedPaths: string[]
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  Object.getPrototypeOf(value) === Object.prototype

const sanitizeValue = <T>(
  value: T,
  path: string,
  warnings: string[]
): ReplaceUndefinedWithNull<T> => {
  if (value === undefined) {
    if (path) warnings.push(path)
    return null as ReplaceUndefinedWithNull<T>
  }

  if (Array.isArray(value)) {
    return value.map((item, index) =>
      sanitizeValue(item, `${path}[${index}]`, warnings)
    ) as ReplaceUndefinedWithNull<T>
  }

  if (value instanceof Date) {
    return value as ReplaceUndefinedWithNull<T>
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value).map(([key, entryValue]) => [
      key,
      sanitizeValue(entryValue, path ? `${path}.${key}` : key, warnings)
    ])

    return Object.fromEntries(entries) as ReplaceUndefinedWithNull<T>
  }

  return value as ReplaceUndefinedWithNull<T>
}

const sanitizePayload = <T extends Record<string, unknown>>(
  data: T
): SanitizerResult<T> => {
  const mutatedPaths: string[] = []
  const sanitized = sanitizeValue(data, '', mutatedPaths)
  return { sanitized, mutatedPaths }
}

export async function firebaseSafeSave<
  T extends Record<string, unknown>,
  R = void
>({ data, saveFn, contextLabel }: FirebaseSafeSaveParams<T, R>): Promise<R> {
  const { sanitized, mutatedPaths } = sanitizePayload(data)

  if (mutatedPaths.length) {
    console.warn(
      `[firebaseSafeSave] Campos cambiados a null${
        contextLabel ? ` (${contextLabel})` : ''
      }: ${mutatedPaths.join(', ')}`
    )
  }

  return saveFn(sanitized)
}

export const firebaseSafeSaveUtils = {
  firebaseSafeSave
}
