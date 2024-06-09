import { v4 as uidGenerator } from 'uuid'

const createId = () =>
  `${(new Date().getTime() - 10000).toFixed(0)}${Math.random()
    .toString(36)
    .substring(7)}`
export const createId2 = () =>
  `${((new Date().getTime() - 1000000000000) / 10).toFixed(0)}${Math.random()
    .toString(36)
    .substring(4)}`

export const createUUID = () => uidGenerator()

export default createId
