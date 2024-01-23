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
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  Query,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch
} from 'firebase/firestore'

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
      created: {
        at: new Date(),
        by: currentUser?.uid,
        byEmail: currentUser?.email
      },
      updated: {
        at: new Date(),
        by: currentUser?.uid,
        byEmail: currentUser?.email
      }
    }
  }

  updateItemMetadata() {
    const currentUser = getAuth().currentUser
    return {
      updated: {
        at: new Date(),
        by: currentUser?.uid,
        byEmail: currentUser?.email
      }
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
    const newItem = {
      ...item,
      ...this.updateItemMetadata()
    }
    return await updateDoc(doc(this.db, this.collectionName, itemId), newItem)
      .then((res) =>
        this.formatResponse(true, `${this.collectionName}_UPDATED`, {
          id: itemId
        })
      )
      .catch((err) => console.error(err))
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
          item: item
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
    const docSnap = await getDoc(ref)
    return this.normalizeItem(docSnap)
  }

  /**
   * * get all documents in a collection implementing filters
   * @param filters: where(itemField,'==','value')
   */
  async getItems(filters: any[]) {
    this.validateFilters(filters, this.collectionName)
    const q: Query = query(collection(this.db, this.collectionName), ...filters)

    const querySnapshot = await getDocs(q)
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

  /**
   * * get all documents in a collection implementing filters
   * @param filters: where(itemField,'==','value')
   */
  async getUserItems(filters: any[]) {
    const q: Query = query(collection(this.db, this.collectionName), ...filters)

    const querySnapshot = await getDocs(q)
    const res: any[] = []
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      res.push(this.normalizeItem(doc))
    })
    return res
  }

  async listenItem(itemId: string, cb: CallableFunction) {
    if (!itemId) return console.error('invalid value', { itemId })
    const q = doc(this.db, this.collectionName, itemId)

    onSnapshot(q, (doc) => {
      cb(this.normalizeItem(doc))
    })
  }

  /**
   * listen all documents in a collection implementing filters
   * @param filters[]: where(itemField,'==','value')
   * @param cb callback with array of items
   */
  async listenItems(filters: any, cb: CallableFunction) {
    this.validateFilters(filters, this.collectionName)

    const q = query(collection(this.db, this.collectionName), ...filters)

    onSnapshot(q, (querySnapshot) => {
      const res: any[] = []
      querySnapshot.forEach((doc) => {
        res.push(this.normalizeItem(doc))
      })
      cb(res)
    })
  }

  async listenUserItems(filters: any = [], cb: CallableFunction) {
    const userId = getAuth().currentUser?.uid
    this.listenItems([where('userId', '==', userId), ...filters], cb)
  }

  // -------------------------------------------------------------> Helpers

  showDataFrom(querySnapshot: any, collection: string) {
    const source = querySnapshot.metadata.fromCache ? 'local cache' : 'server'
    console.log('Data came from ' + source + ' collection ' + collection)
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

  validateFilters(filters: any[], collectionName: string) {
    if (!filters) return console.error('Should have filters implanted')
    if (!Array.isArray(filters))
      return console.error('filter is not an array', {
        collectionName
      })

    //* Validate inside each filter and find if any a the values is invalid
    filters.map((filter) => {
      //* Looks like firebase define a function unsolved if the value of
      if (typeof filter._a === 'function') {
        return console.error('invalid data', {
          segment: filter.fa.segments[0],
          collectionName
        })
      }
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

  formatResponse = (ok: boolean, type: string, res: any) => {
    if (!ok) {
      console.error(type, { type, res })
    }
    const formattedType = type.toUpperCase()
    return { type: formattedType, ok, res }
  }
}

export interface UploadFileAsync {
  file: File
  fieldName: string
}
