import { ServicePayments } from '../firebase/ServicePayments'
import { payments_amount as payments_amount_util } from './paymentsUtils'
export const onVerifyPayment = async (paymentId: string, userId) => {
	await ServicePayments.update(paymentId, {
		verified: true,
		verifiedAt: new Date(),
		verifiedBy: userId
	})
		.then(console.log)
		.catch(console.error)
}
export const onInvalidatePayment = async (paymentId: string, userId) => {
	await ServicePayments.update(paymentId, {
		verified: false,
		verifiedAt: new Date(),
		verifiedBy: userId
	})
		.then(console.log)
		.catch(console.error)
}
export const payments_amount = payments_amount_util
