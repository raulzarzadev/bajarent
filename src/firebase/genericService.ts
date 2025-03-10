import {
  CollectionReference,
  DocumentData,
  QueryConstraint,
  collection,
  doc,
  where
} from 'firebase/firestore'
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

  async get(itemId: T['id']): Promise<T> {
    return await this.itemCRUD.getItem(itemId || '')
  }

  async listen(itemId: T['id'], cb: CallableFunction) {
    return await this.itemCRUD.listenItem(itemId || '', cb)
  }

  async listenMany(filters: QueryConstraint[] = [], cb: CallableFunction) {
    return await this.itemCRUD.listenItems(filters, cb)
  }

  async getItems(filters: QueryConstraint[] = [], ops?: GetItemsOps) {
    return await this.itemCRUD.getItems(filters, ops)
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

  getItemsInCollection(
    {
      parentId,
      subCollection,
      filters = []
    }: {
      parentId: string
      subCollection: string
      filters?: QueryConstraint[]
    },
    ops?: GetItemsOps
  ) {
    return this.itemCRUD.getItemsInCollection(
      {
        parentCollection: this.COLLECTION_NAME,
        parentId,
        subCollection,
        filters
      },
      ops
    )
  }

  getItemInCollection(
    {
      parentId,
      subCollection,
      itemId
    }: {
      parentId: string
      subCollection: string
      itemId: string
    },
    ops?: GetItemsOps
  ) {
    return this.itemCRUD.getItemInCollection(
      {
        parentCollection: this.COLLECTION_NAME,
        parentId,
        subCollection,
        itemId
      },
      ops
    )
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
    return this.itemCRUD
      .updateFieldInSubCollection({
        subCollection,
        itemId,
        field,
        value,
        parentId
      })
      .then((res) => res)
  }
  listenItemsInSubCollection({
    parentId,
    subCollection,
    filters,
    cb
  }: {
    parentId: string
    subCollection: string
    filters?: QueryConstraint[]
    cb: CallableFunction
  }) {
    return this.itemCRUD.listenItemsInSubCollection({
      parentCollection: this.COLLECTION_NAME,
      parentId,
      subCollection,
      filters,
      cb
    })
  }

  //* use refs to create

  createRefItem<T>({
    collectionRef,
    item
  }: {
    collectionRef: CollectionReference<DocumentData>
    item: T
  }) {
    return this.itemCRUD.createRefItem({
      collectionRef,
      item
    })
  }
  getRefItems<T>(
    {
      collectionRef,
      filters
    }: {
      collectionRef: CollectionReference<DocumentData>
      filters: QueryConstraint[]
    },
    ops?: GetItemsOps
  ): Promise<T[]> {
    return this.itemCRUD.getRefItems(
      {
        collectionRef,
        filters
      },
      ops
    )
  }

  listenRefItems({
    collectionRef,
    filters,
    cb
  }: {
    collectionRef: CollectionReference<DocumentData>
    filters: QueryConstraint[]
    cb: CallableFunction
  }) {
    this.itemCRUD.listenRefItems({
      ref: collectionRef,
      filters,
      cb
    })
  }

  getCollectionGroup({
    collectionName,
    filters
  }: {
    collectionName: string
    filters: QueryConstraint[]
  }) {
    return this.itemCRUD.getCollectionGroup({
      collectionName,
      filters
    })
  }

  async listIds({ ids = [] }: { ids: string[] }): Promise<T[]> | null {
    if (ids.length === 0) return []
    const promises = ids?.map((id) => this.get(id))
    return Promise.all(promises).catch((e) => {
      console.error(e)
      return null
    })
  }
}
