import { v4 as uidGenerator } from 'uuid'

const createId = () =>
  `${(new Date().getTime() - 10000).toFixed(0)}${Math.random()
    .toString(36)
    .substring(7)}`
export const createId2 = () =>
  `${((new Date().getTime() - 1000000000000) / 10).toFixed(0)}${Math.random()
    .toString(36)
    .substring(4)}`

export const createUUID = (props?: Props): string => {
  if (props?.length > 0)
    return uidGenerator()
      .slice(0, props?.length || 99999)
      .replace('-', '')
  return uidGenerator()
}

export type Props = { length?: number }

export default createId
