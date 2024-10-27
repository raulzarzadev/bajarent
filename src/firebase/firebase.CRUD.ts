import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'
import { getAuth } from 'firebase/auth'
import { v4 as uidGenerator } from 'uuid'

import {
  addDoc,
  collection,
  collectionGroup,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocFromCache,
  getDocFromServer,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  onSnapshot,
  Query,
  query,
  QueryConstraint,
  QuerySnapshot,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch
} from 'firebase/firestore'
import { dateFormat } from '../libs/utils-date'

export type GetItemsOps = {
  justRefs?: boolean
  fromCache?: boolean //* use cache con cuidado puede no estar actualizado
}
export class FirebaseCRUD {
  static uploadFile(
    files: FileList | null,
    setURL: ((url: string) => void) | undefined
  ) {
    throw new Error('Method not implemented.')
  }

  collectionName: string
  db: any
  storage: any
  constructor(collectionName = '', firebaseDB: any, firebaseStorage: any) {
    this.collectionName = collectionName
    this.db = firebaseDB
    this.storage = firebaseStorage
  }

  /**
   *
   * @param file Blob | Uint8Array | ArrayBuffer, directly from input file
   * @param fieldName this is the directory where the images will be stored
   * @callback cb a function to return the progress
   *
   */

  uploadFile = (
    file: Blob | Uint8Array | ArrayBuffer,
    fieldName = '',
    cb: (progress: number, downloadURL: string | null) => void
  ) => {
    const storageRef = (path = '') => ref(this.storage, path)
    const uuid = uidGenerator()
    const imageRef = storageRef(`${fieldName}/${uuid}`)
    const uploadTask = uploadBytesResumable(imageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done')
        cb(progress, null)
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused')
            break
          case 'running':
            console.log('Upload is running')
            break
        }
      },
      (error) => {
        console.log({ error })
        cb(-1, null)
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL)
          cb(100, downloadURL)
        })
      }
    )
    /*   uploadBytes(storageRef(storagePath), file).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      } */
  }

  /**
   *
   * @param url should be a url from firebase storage
   * @returns
   */
  deleteFile = async (url: string) => {
    const desertRef = ref(this.storage, url)
    try {
      return await deleteObject(desertRef).then((res) => {
        return this.formatResponse(
          true,
          `${this.collectionName}_IMAGE_DELETED`,
          res
        )
      })
    } catch (error) {
      console.log({ error })
    }
  }

  uploadJSON = async ({ json }: { json: any[] }) => {
    try {
      //* TODO: should delete id?
      const batch = writeBatch(this.db)
      const data = json

      const promises = data.map(async (document) => {
        const docRef = await addDoc(
          collection(this.db, this.collectionName),
          document
        )
        return batch.set(docRef, { id: docRef.id, ...document })
      })
      await Promise.all(promises)
      await batch.commit()
      return this.formatResponse(true, 'JSON_UPLOADED', {})
    } catch (error) {
      return this.formatResponse(false, 'JSON_UPLOADED_ERROR', error)
    }
  }

  // -------------------------------------------------------------> CRUD-Items

  /**
   *
   * @param item object to create
   * @returns promise add doc
   */

  createItemMetadata() {
    const currentUser = getAuth().currentUser
    return {
      createdBy: currentUser?.uid || 'no-user',
      createdAt: new Date()
    }
    // return {
    //   created: {
    //     at: new Date(),
    //     by: currentUser?.uid,
    //     byEmail: currentUser?.email
    //   },
    //   updated: {
    //     at: new Date(),
    //     by: currentUser?.uid,
    //     byEmail: currentUser?.email
    //   }
    // }
  }

  updateItemMetadata() {
    const currentUser = getAuth().currentUser
    return {
      updatedAt: new Date(),
      updatedBy: currentUser?.uid
    }
  }

  async createItem(item: object) {
    const newItem = {
      ...item,
      ...this.createItemMetadata()
    }

    return await addDoc(collection(this.db, this.collectionName), newItem).then(
      (res) =>
        this.formatResponse(true, `${this.collectionName}_CREATED`, {
          id: res.id
        })
    )
  }

  async updateItem(itemId: string, item: object) {
    if (!itemId) return console.error('invalid value', { itemId })
    const newItem = {
      ...item,
      ...this.updateItemMetadata()
    }
    try {
      return await updateDoc(doc(this.db, this.collectionName, itemId), newItem)
        .then((res) =>
          this.formatResponse(true, `${this.collectionName}_UPDATED`, {
            id: itemId
          })
        )
        .catch((err) => {
          console.error(err)
        })
    } catch (error) {
      console.log({ error })
    }
  }

  async setItem(itemId: string, newItem: object) {
    const item = {
      id: itemId,
      ...this.createItemMetadata(),
      ...newItem
    }

    return await setDoc(doc(this.db, this.collectionName, itemId), item)
      .then((res) =>
        this.formatResponse(true, `${this.collectionName}_CREATED`, {
          item
        })
      )
      .catch((err) => console.error(err))
  }

  /**
   * get a single document from the collection
   * @param itemId the id of the document to get
   */
  async getItem(itemId: string) {
    const ref = doc(this.db, this.collectionName, itemId)
    // const docSnap = await getDoc(ref)
    let docSnap
    try {
      docSnap = await getDocFromCache(ref)
    } catch (error) {
      docSnap = await getDocFromServer(ref)
    }

    //* <------ Show getting data in DEV mode
    this.showSnapshot(docSnap)

    return this.normalizeItem(docSnap)
  }

  /**
   * * get all documents in a collection implementing filters
   * @param filters: where(itemField,'==','value')
   */

  async getItems(filters: QueryConstraint[], ops?: GetItemsOps) {
    this.validateFilters(filters, this.collectionName)
    const q: Query = query(collection(this.db, this.collectionName), ...filters)

    let querySnapshot: QuerySnapshot<DocumentData, DocumentData>
    if (ops?.fromCache) {
      querySnapshot = await getDocsFromCache(q)
    } else {
      querySnapshot = await getDocs(q)
    }

    //* <------ Show getting data in DEV mode
    this.showSnapshot(querySnapshot)

    if (ops?.justRefs) {
      return querySnapshot.docs.map((doc) => doc.ref)
    }

    const res: any[] = []
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      res.push(this.normalizeItem(doc))
    })
    return res
  }

  async deleteItem(itemId: string) {
    return await deleteDoc(doc(this.db, this.collectionName, itemId))
      .then((res) =>
        this.formatResponse(true, `${this.collectionName}_DELETED`, res)
      )
      .catch((err) => console.error(err))
  }

  async deleteItems(filters: QueryConstraint[] = []): Promise<
    {
      type: string
      ok: boolean
      res: {
        id: string
      }
    }[]
  > {
    this.validateFilters(filters, this.collectionName)
    const q: Query = query(collection(this.db, this.collectionName), ...filters)

    const querySnapshot = await getDocs(q)
    const res: any[] = []
    querySnapshot.forEach((doc) => {
      res.push(
        deleteDoc(doc.ref)
          .then((res) =>
            this.formatResponse(true, `${this.collectionName}_DELETED`, res)
          )
          .catch((err) => console.error(err))
      )
    })
    return res
  }

  /**
   * * get all documents in a collection implementing filters
   * @param filters: QueryConstraint  where(itemField,'==','value')
   */
  async getUserItems(filters: QueryConstraint[]) {
    const q: Query = query(collection(this.db, this.collectionName), ...filters)

    const querySnapshot = await getDocs(q)
    const res: any[] = []

    //* <------ Show getting data in DEV mode
    this.showSnapshot(querySnapshot)

    querySnapshot.forEach((doc) => {
      res.push(this.normalizeItem(doc))
    })
    return res
  }

  async listenItem(itemId: string, cb: CallableFunction) {
    if (!itemId) return console.error('invalid value', { itemId })
    const q = doc(this.db, this.collectionName, itemId)

    onSnapshot(q, (snapshotDoc) => {
      //* <------ Show getting data in DEV mode
      this.showSnapshot(snapshotDoc)

      cb(this.normalizeItem(snapshotDoc))
    })
  }

  /**
   * listen all documents in a collection implementing filters
   * @param filters[]: where(itemField,'==','value')
   * @param cb callback with array of items
   */
  async listenItems(filters: QueryConstraint[], cb: CallableFunction) {
    this.validateFilters(filters, this.collectionName)

    const q = query(collection(this.db, this.collectionName), ...filters)
    onSnapshot(q, (querySnapshot) => {
      const res: any[] = []

      //* <------ Show getting data in DEV mode
      this.showSnapshot(querySnapshot)

      querySnapshot.forEach((doc) => {
        res.push(this.normalizeItem(doc))
      })
      cb(res)
    })
  }

  async listenUserItems(filters: QueryConstraint[] = [], cb: CallableFunction) {
    const userId = getAuth().currentUser?.uid

    this.listenItems([where('userId', '==', userId), ...filters], cb)
  }

  // -------------------------------------------------------------> SUB COLLECTIONS
  async createItemInCollection(
    collectionRef: any,
    item: object
  ): Promise<{
    type: string
    ok: boolean
    res: {
      id: string
    }
  }> {
    const newItem = {
      ...item,
      ...this.createItemMetadata()
    }
    return await addDoc(collectionRef, newItem)
      .then((res) =>
        this.formatResponse(true, `${this.collectionName}_CREATED`, {
          id: res.id
        })
      )
      .catch((err) => {
        console.error(err)
        return this.formatResponse(false, `${this.collectionName}_ERROR`, err)
      })
  }
  async createRefItem<T>({
    collectionRef,
    item
  }: {
    collectionRef: CollectionReference<DocumentData>
    item?: T
  }) {
    const newItem = {
      ...item,
      ...this.createItemMetadata()
    }
    return await addDoc(collectionRef, newItem)
      .then((res) =>
        this.formatResponse(true, `${this.collectionName}_CREATED`, {
          id: res.id
        })
      )
      .catch((err) => {
        console.error(err)
        return this.formatResponse(false, `${this.collectionName}_ERROR`, err)
      })
  }

  async getRefItems(
    {
      collectionRef,
      filters
    }: {
      collectionRef: CollectionReference<DocumentData>
      filters?: QueryConstraint[]
    },
    ops?: GetItemsOps
  ) {
    const res: any[] = []
    const q: Query<DocumentData> = query(collectionRef, ...filters)
    let querySnapshot: QuerySnapshot<DocumentData, DocumentData>
    // console.log('fromCacheRef', ops?.fromCache)
    if (ops?.fromCache) {
      querySnapshot = await getDocsFromCache(q)
    } else {
      querySnapshot = await getDocs(q)
    }

    if (ops?.justRefs) {
      return querySnapshot.docs.map((doc) => doc.ref)
    }

    //* <------ Show getting data in DEV mode
    this.showSnapshot(querySnapshot)

    querySnapshot.forEach((doc) => {
      res.push(doc)
    })
    return res.map((doc) => this.normalizeItem(doc))
  }

  async getItemsInCollection(
    {
      parentId,
      parentCollection,
      subCollection,
      filters = []
    }: {
      parentId: string
      parentCollection: string
      subCollection: string
      filters?: QueryConstraint[]
    },
    ops?: GetItemsOps
  ) {
    const ref = collection(this.db, parentCollection, parentId, subCollection)
    const queryRef = query(ref, ...filters)

    let querySnapshot
    if (ops?.fromCache) {
      querySnapshot = await getDocsFromCache(queryRef)
    } else {
      querySnapshot = await getDocs(queryRef)
    }
    if (ops?.justRefs) return querySnapshot?.docs?.map((doc) => doc?.ref)

    const res: any[] = []

    //* <------ Show getting data in DEV mode
    this.showSnapshot(querySnapshot)

    querySnapshot.forEach((doc) => {
      res.push(this.normalizeItem(doc))
    })
    return res
  }

  async getItemInCollection(
    {
      parentId,
      parentCollection,
      subCollection,
      itemId
    }: {
      parentId: string
      parentCollection: string
      subCollection: string
      itemId
    },
    ops?: GetItemsOps
  ) {
    const ref = doc(this.db, parentCollection, parentId, subCollection, itemId)

    if (ops?.justRefs) return ref

    const docSnap = await getDoc(ref)

    //* <------ Show getting data in DEV mode
    this.showSnapshot(docSnap)

    return this.normalizeItem(docSnap)
  }

  async updateItemInCollection({
    parentId,
    parentCollection,
    subCollection,
    itemId,
    itemData
  }: {
    parentId: string
    parentCollection: string
    subCollection: string
    itemId: string
    itemData: object
  }) {
    const newItem = {
      ...itemData,
      ...this.updateItemMetadata()
    }
    return await updateDoc(
      doc(this.db, parentCollection, parentId, subCollection, itemId),
      newItem
    )
      .then((res) =>
        this.formatResponse(true, `${this.collectionName}_UPDATED`, {
          id: itemId
        })
      )
      .catch((err) => {
        console.error(err)
        return this.formatResponse(false, `${this.collectionName}_ERROR`, err)
      })
  }

  async getCollectionGroup({
    collectionName,
    filters
  }: {
    collectionName: string
    filters: QueryConstraint[]
  }) {
    const q = query(collectionGroup(this.db, collectionName), ...filters)
    const querySnapshot = await getDocs(q)

    //* <------ Show getting data in DEV mode
    this.showSnapshot(querySnapshot)

    const res: any[] = []
    querySnapshot.forEach((doc) => {
      res.push(this.normalizeItem(doc))
    })
    console.log('group collection', res)
    return res
  }

  async deleteItemInCollection({
    parentId,
    parentCollection,
    subCollection,
    itemId
  }: {
    parentId: string
    parentCollection: string
    subCollection: string
    itemId: string
  }) {
    return deleteDoc(
      doc(this.db, parentCollection, parentId, subCollection, itemId)
    )
      .then((res) =>
        this.formatResponse(true, `${this.collectionName}_DELETED`, {
          id: itemId
        })
      )
      .catch((err) => {
        console.error(err)
        return this.formatResponse(false, `${this.collectionName}_ERROR`, err)
      })
  }

  async updateFieldInSubCollection({
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
    const ref = doc(
      this.db,
      this.collectionName,
      parentId,
      subCollection,
      itemId
    )
    return await updateDoc(ref, { [field]: value })
      .then((res) =>
        this.formatResponse(true, `${this.collectionName}_UPDATED`, {
          id: itemId
        })
      )
      .catch((err) => {
        return this.formatResponse(false, `${this.collectionName}_ERROR`, err)
      })
  }

  listenRefItems({
    cb,
    ref,
    filters
  }: {
    cb: CallableFunction
    ref: CollectionReference
    filters?: QueryConstraint[]
  }) {
    const q: Query<DocumentData> = query(ref, ...filters)
    onSnapshot(q, (querySnapshot) => {
      const res: any[] = []
      querySnapshot.forEach((doc) => {
        res.push(this.normalizeItem(doc))
      })

      //* <------ Show getting data in DEV mode
      this.showSnapshot(querySnapshot)

      cb(res)
    })
  }

  listenItemsInSubCollection({
    parentId,
    parentCollection,
    subCollection,
    filters = [],
    cb
  }: {
    parentId: string
    parentCollection: string
    subCollection: string
    filters?: QueryConstraint[]
    cb: CallableFunction
  }) {
    const ref = collection(this.db, parentCollection, parentId, subCollection)
    const queryRef = query(ref, ...filters)
    onSnapshot(queryRef, (querySnapshot) => {
      //* <------ Show getting data in DEV mode
      this.showSnapshot(querySnapshot)

      const res: any[] = []
      querySnapshot.forEach((doc) => {
        res.push(this.normalizeItem(doc))
      })
      cb(res)
    })
  }

  createItemInSubCollectionRef({ ref, item }) {}

  // -------------------------------------------------------------> Helpers

  // showDataSource(isFromCache: any, collection: string, method: string) {
  //   return null
  //   if (process.env.PRE_PRODUCTION !== 'true') return
  //   const source = isFromCache ? 'cache' : 'server'
  //   console.log(`${source} ${method} ${collection} `)
  // }
  showSnapshot(
    querySnapshot:
      | QuerySnapshot<DocumentData, DocumentData>
      | DocumentSnapshot<DocumentData>,

    subCollection = ''
  ) {
    if (process.env.PRE_PRODUCTION !== 'true') return
    let totalSize = 0

    if (querySnapshot instanceof DocumentSnapshot) {
      const docData = querySnapshot.data()
      const docSize = new TextEncoder().encode(JSON.stringify(docData)).length
      totalSize += docSize
      return
    }
    querySnapshot.forEach((doc) => {
      const docData = doc.data()
      const docSize = new TextEncoder().encode(JSON.stringify(docData)).length
      totalSize += docSize
    })
    //console.log(querySnapshot.query._query.filters.map((f) => f))
    //@ts-ignore
    const filters = querySnapshot.query._query.filters.map((f) => {
      const formattedDate = f?.value?.timestampValue
        ? dateFormat(f.value.timestampValue, 'ddMMMyy', true)
        : null

      const booleanValue =
        typeof f?.value?.booleanValue === 'boolean'
          ? `${f.value.booleanValue}`
          : null

      const arrayValues =
        f?.value?.arrayValue?.values?.map((v) => v?.stringValue)?.join(', ') ||
        null

      const stringValues = f?.value?.stringValue

      return `${f?.field?.segments[0]} ${f?.op} ${
        stringValues || formattedDate || booleanValue || arrayValues
      }`
    })
    //@ts-ignore
    const segments = querySnapshot?.query?._query?.path?.segments?.join('/')

    console.log([
      segments,
      querySnapshot.metadata.fromCache,
      `${(totalSize / 1024).toFixed(2)}kb`,
      filters,
      querySnapshot.size
    ])
  }

  transformAnyToDate = (date: unknown): Date | null => {
    if (!date) return null
    if (date instanceof Timestamp) {
      return date.toDate()
    } else if (date instanceof Date) {
      return date
    } else if (typeof date === 'number') {
      return new Date(date)
    } else if (typeof date === 'string') {
      const aux = new Date(date)
      if (isNaN(aux.getTime())) {
        return null
      } else {
        return aux
      }
    } else {
      console.error('date is not valid date')
      return null
    }
  }

  validateFilters(
    filters: QueryConstraint[],
    collectionName: string
  ): QueryConstraint[] | null {
    if (!filters) {
      console.error('Should have filters implanted')
      return null
    }
    if (!Array.isArray(filters)) {
      console.error('filter is not an array', {
        collectionName
      })
      return null
    }

    //* Validate inside each filter and find if any a the values is invalid
    filters.forEach((filter) => {
      //* Looks like firebase define a function unsolved if the value of
      if (!(filter instanceof QueryConstraint))
        return console.error('invalid filter', {
          filter,
          collectionName
        })
      // if (typeof filter._a === 'function') {
      //   return console.error('invalid data', {
      //     segment: filter.fa.segments[0],
      //     collectionName
      //   })
      // }
    })

    return filters
  }

  normalizeItems = (docs = []) => docs?.map((doc) => this.normalizeItem(doc))

  normalizeItem = (doc: any) => {
    const id = doc.id
    if (!doc?.exists()) {
      console.error(
        `document ${id} in collection:${this.collectionName} not found`
      )
      return null
    } // The document  not exist
    const data = doc.data()

    const res = data
    // console.log(res)
    if (res) {
      return { ...res, id }
    } else {
      console.log(
        `error formatting document ${id} in collection:${this.collectionName} not found`
      )
      return null
    }
  }

  // createCollectionRef(
  //   collectionName: string,
  //   docId?: string,
  //   subCollectionName?: string
  // ) {
  //   // Referencia a la colección principal
  //   let ref = collection(this.db, collectionName)

  //   // Si se proporcionan docId y subCollectionName, crear referencia a la subcolección
  //   if (docId && subCollectionName) {
  //     ref = collection(this.db, collectionName, docId, subCollectionName)
  //   }

  //   return ref
  // }

  // getByRef = async (ref: any) => {
  //   const docSnap = await getDocFromCache(ref)
  //   return this.normalizeItem(docSnap)
  // }
  // updateByRef = async (ref: any, data: any) => {
  //   return await updateDoc(ref, data)
  //     .then((res) => {
  //       return this.formatResponse(true, 'UPDATED_BY_REF', res)
  //     })
  //     .catch((err) => {
  //       console.error(err)
  //       return this.formatResponse(false, 'UPDATED_BY_REF_ERROR', err)
  //     })
  // }

  formatResponse = (ok: boolean, type: string, res: any): FormattedResponse => {
    if (!ok) {
      console.error(type, { type, res })
    }
    const formattedType = type?.toUpperCase()
    return { type: formattedType, ok, res }
  }
}

export type FormattedResponse = {
  type: string
  ok: boolean
  res: {
    code: string
    id: string
  }
}

export interface UploadFileAsync {
  file: File
  fieldName: string
}
