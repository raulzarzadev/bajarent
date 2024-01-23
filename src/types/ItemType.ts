import BaseType from './BaseType'

type ItemBase = {
  name: string
  description: string
  image: string
  category: string
  serialNumber: string
}

type ItemType = BaseType & ItemBase

export default ItemType
