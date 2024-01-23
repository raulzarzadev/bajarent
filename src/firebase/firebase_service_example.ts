type ExampleType = {
  id: string
  name: string
}
import { storage } from './auth'
import { FirebaseCRUD } from './firebase.CRUD'
import { db } from './main'
/*
 * You should be able to copy all this file and just replace
 * ItemType
 * NewItemType
 * COLLECTION_NAME
 * And the name of the Class
 */

//* -------- *** Change FIREBASE_COLLECTION_NAME *** ---------
const COLLECTION_NAME = 'example'
//* -------- *** Change ITEM_TYPE *** ---------
type ItemType = ExampleType

type CreateItem = Partial<ItemType>

export const itemCRUD = new FirebaseCRUD(COLLECTION_NAME, db, storage)

//* -------- *** Change CLASS_NAME *** ---------
export class ExampleService {
  constructor() {
    //console.log('ExampleService')
  }
  async create(newItem: CreateItem) {
    return await itemCRUD.createItem({ ...newItem })
  }
  async set(itemId: ItemType['id'], newItem: CreateItem) {
    return await itemCRUD.setItem(itemId || '', { ...newItem, id: itemId })
  }
  async update(itemId: string, updates: CreateItem) {
    return await itemCRUD.updateItem(itemId, updates)
  }
  async delete(itemId: ItemType['id']) {
    return await itemCRUD.deleteItem(itemId || '')
  }
  async get(itemId: ItemType['id']) {
    return await itemCRUD.getItem(itemId || '')
  }
  async listen(itemId: ItemType['id'], cb: CallableFunction) {
    return await itemCRUD.listenItem(itemId || '', cb)
  }
}
