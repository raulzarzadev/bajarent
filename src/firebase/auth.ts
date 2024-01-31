import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'firebase/auth'

import { getStorage } from 'firebase/storage'
import { FirebaseCRUD } from './firebase.CRUD'
import { app, db } from './main'
// import { findUserByEmail, getUser, setUser } from './users'
import UserType from '../types/UserType'
import { ServiceUsers } from './ServiceUser'
import { where } from 'firebase/firestore'

export const auth = getAuth(app)
auth.languageCode = 'es'
export const storage = getStorage(app)

// CREATE A MAIN INSTANCE FOR USERS
export const usersCRUD = new FirebaseCRUD('users', db, storage)

export const createUserFromGoogleProvider = async (newItem: any) => {
  const { uid, photoURL, email, displayName } = newItem
  const userFormatted: Partial<UserType> = {
    id: uid,
    image: photoURL,
    email,
    name: displayName
  }
  return await usersCRUD.setItem(uid, userFormatted)
}

export async function authStateChanged(cb: CallableFunction) {
  onAuthStateChanged(auth, async (user) => {
    if (user?.uid) {
      const dbUser = await ServiceUsers.get(user.uid)
      if (dbUser) return cb(dbUser)
      const newUser = {
        name: user.displayName || '',
        email: user.email || '',
        // rol: 'CLIENT',
        image: user.photoURL || '',
        phone: user.phoneNumber || ''
      }
      await ServiceUsers.set(user.uid, newUser)
      const userCreated = await ServiceUsers.get(user.uid)
      //* create a default new user when is the first login
      cb(userCreated)
    } else {
      cb(null)
    }
  })
}

export async function googleLogin() {
  const provider = new GoogleAuthProvider()
  return await signInWithPopup(auth, provider)
    .then(async (result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result)
      // const token = credential?.accessToken
      // The signed-in user info.
      const user = result.user

      if (user) {
        // const dbUser = await findUserByEmail({ email: user.email || '' })
        const dbUser = await ServiceUsers.findOne([
          where('email', '==', user.email || '')
        ])
        if (dbUser) return dbUser

        const newUser = await ServiceUsers.set(user.uid, {
          name: user.displayName || ''
          // email: user.email || '',
          // rol: 'CLIENT',
          // image: user.photoURL || ''
        })

        return newUser
      }
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      const email = error?.customData?.email
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)
      console.error({ errorCode, errorMessage, email, credential })
      throw new Error('error in google login')
      // return null
    })
}

export async function createUserWithPassword({
  email,
  password,
  name
}: {
  email: string
  password: string
  name: string
}) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in
      const user = userCredential.user

      if (user) {
        const dbUser = await ServiceUsers.findByEmail(user.email)
        if (dbUser) return dbUser

        const newUser = await ServiceUsers.set(user.uid, {
          name: user.displayName || name || ''
          //  email: user.email || '',
          // rol: 'CLIENT',
          //  image: user.photoURL || ''
        })

        return newUser
      }
      // ...
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      console.error({ errorCode, errorMessage })
      // ..
    })
}

export const passwordReset = async (email: string) => {
  return await sendPasswordResetEmail(auth, email)
}

export const confirmThePasswordReset = async (
  oobCode: string,
  newPassword: string
) => {
  if (!oobCode && !newPassword) return
  return await confirmPasswordReset(auth, oobCode, newPassword)
}

export async function signInWithPassword({
  email,
  password
}: {
  email: string
  password: string
}) {
  return signInWithEmailAndPassword(auth, email, password)
  // .then((userCredential) => {
  //   // Signed in
  //   const user = userCredential.user
  //   // ...
  // })
  // .catch((error) => {
  //   const errorCode = error.code
  //   const errorMessage = error.message
  //   console.error({ errorCode, errorMessage })
  // })
}

export async function logout() {
  return await signOut(auth)
}

export async function getCurrentUser() {
  return auth.currentUser
}
