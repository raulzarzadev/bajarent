import { QueryConstraint, collection, doc, where } from 'firebase/firestore'
import { storage } from './auth'
import { FirebaseCRUD, GetItemsOps } from './firebase.CRUD'
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

  async findMany(filters: QueryConstraint[] = [], ops?: GetItemsOps) {
    return await this.itemCRUD.getItems(filters, ops)
  }

  async deleteMany(filters: QueryConstraint[] = []) {
    return await this.itemCRUD.deleteItems(filters)
  }

  listenByStore(storeId: string, cb: CallableFunction) {
    return this.listenMany([where('storeId', '==', storeId)], cb)
  }

  // SUB_COLLECTIONS

  // Paso 1: Método para obtener una referencia a una subcolección
  getSubCollectionRef(parentId: string, subCollectionName: string) {
    const parentDocRef = doc(db, this.COLLECTION_NAME, parentId)
    return collection(db, parentDocRef.path, subCollectionName)
  }

  /**
   *
   * @param parentId Id del documento padre
   * @param subCollectionName Nombre de la subcolección
   * @param newItem Datos del nuevo documento
   * @returns
   */
  async createInSubCollection({
    parentId,
    subCollectionName,
    newItem
  }: {
    parentId: string
    subCollectionName: string
    newItem: CreateItem<T>
  }) {
    const subCollectionRef = this.getSubCollectionRef(
      parentId,
      subCollectionName
    )
    return await this.itemCRUD.createItemInCollection(subCollectionRef, newItem)
  }

  /**
   *
   * @param parentId Id del documento padre
   * @param subCollection Nombre de la subcolección
   * @param filters Filtros para la consulta
   * @returns
   */

  getItemsInCollection({
    parentId,
    subCollection,
    filters = []
  }: {
    parentId: string
    subCollection: string
    filters?: QueryConstraint[]
  }) {
    return this.itemCRUD.getItemsInCollection({
      parentCollection: this.COLLECTION_NAME,
      parentId,
      subCollection,
      filters
    })
  }

  getItemInCollection({
    parentId,
    subCollection,
    itemId
  }: {
    parentId: string
    subCollection: string
    itemId: string
  }) {
    return this.itemCRUD.getItemInCollection({
      parentCollection: this.COLLECTION_NAME,
      parentId,
      subCollection,
      itemId
    })
  }

  updateInSubCollection({
    parentId,
    subCollection,
    itemId,
    itemData
  }: {
    parentId: string
    subCollection: string
    itemId: string
    itemData: CreateItem<T>
  }) {
    return this.itemCRUD.updateItemInCollection({
      parentCollection: this.COLLECTION_NAME,
      parentId,
      subCollection,
      itemId,
      itemData
    })
  }
  deleteInSubCollection({
    parentId,
    subCollection,
    itemId
  }: {
    parentId: string
    subCollection: string
    itemId: string
  }) {
    return this.itemCRUD.deleteItemInCollection({
      parentCollection: this.COLLECTION_NAME,
      parentId,
      subCollection,
      itemId
    })
  }

  updateFieldInSubCollection({
    parentId,
    subCollection,
    itemId,
    field,
    value
  }: {
    parentId: string
    subCollection: string
    itemId: string
    field: string
    value: any
  }) {
    return this.itemCRUD.updateFieldInSubCollection({
      subCollection,
      itemId,
      field,
      value,
      parentId
    })
  }
}
