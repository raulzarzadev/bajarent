import { initializeApp } from 'firebase/app'
import {
  memoryLocalCache,
  initializeFirestore,
  persistentLocalCache
} from 'firebase/firestore'

const firebaseConfig = process.env.FIREBASE_CONFIG || ''
export const app = initializeApp(JSON.parse(firebaseConfig))
export const db = initializeFirestore(app, {
  localCache: memoryLocalCache()
  // localCache: persistentLocalCache()
})
