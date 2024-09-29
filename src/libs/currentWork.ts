/**
 *
 * @param done resolved orders
 * @param pending pending orders
 * @returns number of progress in percentage done / (done + pending) * 100
 */
export function calculateProgress(done = 0, pending = 0) {
  if (done < 0) return 0
  const total = done + pending
  if (total === 0) return 0
  const progress = (done / total) * 100
  return progress
}
