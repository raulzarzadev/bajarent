import { QueryConstraint } from 'firebase/firestore'
import { storage } from './auth'
import { FirebaseCRUD } from './firebase.CRUD'
import { db } from './main'

type CreateItem<T> = Partial<T>

interface Identifiable {
  id: string
}
export class FirebaseGenericService<T extends Identifiable> {
  private itemCRUD: FirebaseCRUD

  constructor(private COLLECTION_NAME: string) {
    this.itemCRUD = new FirebaseCRUD(this.COLLECTION_NAME, db, storage)
  }

  async create(newItem: CreateItem<T>) {
    return await this.itemCRUD.createItem({ ...newItem })
  }

  async set(itemId: T['id'], newItem: CreateItem<T>) {
    return await this.itemCRUD.setItem(itemId || '', { ...newItem, id: itemId })
  }

  async update(itemId: string, updates: CreateItem<T>) {
    return await this.itemCRUD.updateItem(itemId, updates)
  }

  async delete(itemId: T['id']) {
    return await this.itemCRUD.deleteItem(itemId || '')
  }

  async get(itemId: T['id']) {
    return await this.itemCRUD.getItem(itemId || '')
  }

  async listen(itemId: T['id'], cb: CallableFunction) {
    return await this.itemCRUD.listenItem(itemId || '', cb)
  }

  async listenMany(filters: QueryConstraint[] = [], cb: CallableFunction) {
    return await this.itemCRUD.listenItems(filters, cb)
  }

  async getItems(filters: QueryConstraint[] = []) {
    return await this.itemCRUD.getItems(filters)
  }

  async findOne(filters: QueryConstraint[] = []) {
    return await this.itemCRUD.getItems(filters).then((items) => items[0])
  }

  async findMany(filters: QueryConstraint[] = []) {
    return await this.itemCRUD.getItems(filters)
  }
}
