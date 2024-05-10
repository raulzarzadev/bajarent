import { initializeApp } from 'firebase/app'
import {
  memoryLocalCache,
  initializeFirestore,
  persistentLocalCache,
  connectFirestoreEmulator
} from 'firebase/firestore'

// use persistentLocalCache always
const USE_PERSISTANCE_CACHE = true
export const USE_EMULATOR = false
// use memoryLocalCache for development and persistentLocalCache for production
// const localCache = __DEV__ ? persistentLocalCache() : memoryLocalCache()

const firebaseConfig = process.env.FIREBASE_CONFIG || ''
export const app = initializeApp(JSON.parse(firebaseConfig))
export const db = initializeFirestore(app, {
  localCache: USE_PERSISTANCE_CACHE
    ? persistentLocalCache()
    : memoryLocalCache()
})
if (USE_EMULATOR) {
  console.log('connecting to emulator')
  connectFirestoreEmulator(db, '127.0.0.1', 9098)
}
