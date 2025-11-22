type Result<T> = [error: Error, data: null] | [error: null, data: T]

export default async function catchError<T>(
  promise: Promise<T>
): Promise<Result<T>> {
  try {
    const data = await promise
    return [null, data]
  } catch (error) {
    return [error as Error, null]
  }
}
