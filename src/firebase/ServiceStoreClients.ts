import { collection, query, getDocs, addDoc, where } from 'firebase/firestore'
import { db } from './main'
import { ClientType } from '../types/ClientType'
import { auth } from './auth'
export class ServiceStoresClientsClass {
  async getStoreClients(storeId: string) {
    const clientsRef = collection(db, 'stores', storeId, 'clients')
    const clientsQuery = query(clientsRef)
    const clientsSnapshot = await getDocs(clientsQuery)
    const clients = clientsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    }))
    return clients
  }

  async createStoreClient(storeId: string, clientData: Partial<ClientType>) {
    const currentUser = auth.currentUser
    const newClient: Partial<ClientType> = {
      ...clientData,

      createdAt: new Date(),
      createdBy: currentUser.uid
    }
    const clientsRef = collection(db, 'stores', storeId, 'clients')
    const newClientRef = await addDoc(clientsRef, newClient)
    const newClientId = newClientRef.id

    return newClientId
  }

  async getActiveStoreClient(storeId: string) {
    const clientsRef = collection(db, 'stores', storeId, 'clients')
    const activeClientsQuery = query(clientsRef, where('isActive', '==', true))
    const activeClientsSnapshot = await getDocs(activeClientsQuery)

    const activeClients = activeClientsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    }))
    return activeClients
  }

  async searchSimilarClients(storeId: string, client: Partial<ClientType>) {
    const clientsRef = collection(db, 'stores', storeId, 'clients')
    let queries = []
    if (client.name) {
      queries.push(query(clientsRef, where('name', '==', client.name)))
    }
    if (client.phone) {
      queries.push(query(clientsRef, where('phone', '==', client.phone)))
    }
    if (client.address) {
      queries.push(query(clientsRef, where('email', '==', client.address)))
    }
    if (client.imageID) {
      queries.push(query(clientsRef, where('imageID', '==', client.imageID)))
    }
    if (client.imageHouse) {
      queries.push(
        query(clientsRef, where('isActive', '==', client.imageHouse))
      )
    }

    const results = await Promise.all(queries.map(getDocs))

    // results ahora es un array de QuerySnapshot, donde cada elemento corresponde a los resultados de cada consulta
    // Puedes procesar estos resultados según tus necesidades
    const similarClients = []
    results.forEach((snapshot) => {
      snapshot.forEach((doc) => {
        // Evitar duplicados
        if (!similarClients.some((client) => client.id === doc.id)) {
          similarClients.push({ id: doc.id, ...doc.data() })
        }
      })
    })
    return similarClients
  }
}

export const ServiceStoresClients = new ServiceStoresClientsClass()
