import * as dotenv from 'dotenv'
import admin from 'firebase-admin'
import { resolve } from 'path'

//import { firebase_config_prod } from '../../../service_accounts/firebase_config_prod'
//const serviceAccount = require('../../../service_accounts/service_account_prod.json')

//* THIS SCRIPT IS USED TO MIGRATE THE BALANCES COLLECTION TO DAILY BALANCES

/* ******************************************** 
?? THIS SCRIPT IS USED TO MIGRATE THE BALANCES COLLECTION TO DAILY BALANCES
      !!!!   MIGRATION IS COMPLETED AND NOW IT SHOULD BE NOT NECESARY TO RUN THIS SCRIPT
 *******************************************rz */

dotenv.config() // Carga .env al inicio
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

//const FIREBASE_CONFIG = JSON.parse(process.env.FIREBASE_CONFIG || '')
const FIREBASE_CONFIG = {}
export const app = admin.initializeApp({
	...FIREBASE_CONFIG,
	credential: admin.credential.cert({})
})
export const db = admin.firestore()

async function migrateToDailyBalances() {
	console.log('Iniciando migración...')

	// Consulta todos los documentos
	const balancesRef = db.collection('balancesV3')
	const querySnapshot = await balancesRef.get()
	console.log(`Documentos encontrados: ${querySnapshot.size}`)

	// Batch para actualizaciones
	const docsToUpdate = []

	querySnapshot.forEach(document => {
		const data = document.data()
		if (!('type' in data)) {
			docsToUpdate.push(document.ref)
		}
	})
	console.log('Documentos para actualizar', docsToUpdate.length)

	// Constante para tamaño máximo de batch
	const BATCH_SIZE = 100 // Dejamos margen para seguridad (máximo es 500)

	let totalUpdated = 0
	for (let i = 0; i < docsToUpdate.length; i++) {
		//create a batch for each BATCH_SIZE documents
		const batch = db.batch()
		const currentBatch = docsToUpdate.slice(i, i + BATCH_SIZE)
		console.log('Current batch', currentBatch.length)
		currentBatch.forEach(docRef => {
			batch.update(docRef, { type: 'daily' })
		})
		console.log('Committing')
		await batch.commit()
		console.log(`✅ Actualizados ${currentBatch.length} documentos`)
		totalUpdated += currentBatch.length
		console.log(
			`✅ Batch ${i + 1}: Actualizados ${currentBatch.length} documentos (Total: ${totalUpdated})`
		)
	}

	console.log(`✅ Migración completada. Total actualizado: ${totalUpdated} documentos`)
}

migrateToDailyBalances()
