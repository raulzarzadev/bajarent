import { deleteField } from 'firebase/firestore'
import createId, { createId2 } from '../libs/createId'
import { ServiceStoresClass } from './ServiceStore'
import ItemType from '../types/ItemType'
import StoreType from '../types/StoreType'
import { getAuth } from 'firebase/auth'

class ServiceStoreItemsClass extends ServiceStoresClass {
  async itemCreate(storeId, { item }: { item: Partial<ItemType> }) {
    const currentUser = getAuth().currentUser

    const createdBy = currentUser?.uid || ''

    const id = createId2()
    item.id = id
    item.createdAt = new Date()
    item.createdBy = createdBy

    return this.update(storeId, {
      [`items.${id}`]: item
    })
  }
  itemUpdate(
    storeId: StoreType['id'],
    itemId: ItemType['id'],
    item: Partial<ItemType>
  ) {
    item.updatedAt = new Date()
    item.updatedBy = getAuth().currentUser?.uid || ''
    return this.update(storeId, {
      [`items.${itemId}`]: item
    })
  }
  itemDelete(storeId: StoreType['id'], itemId: ItemType['id']) {
    return this.update(storeId, {
      [`items.${itemId}`]: deleteField()
    })
  }
  itemFindOne() {
    console.log('find one item')
  }
  itemFindMany() {
    console.log('find many items')
  }
}

export const ServiceStoreItems = new ServiceStoreItemsClass()
