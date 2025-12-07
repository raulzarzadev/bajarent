import { Timestamp } from 'firebase/firestore'

export type Order = {
	id: string
	clientName: string
	createdAt: Timestamp
	type: 'RENT' | 'REPAIR' | 'SALE'
}
export const orders: Order[] = [
	{
		id: '2',
		clientName: 'John Doe',
		createdAt: getRandomTimestamp(),
		type: getRandomType()
	},
	{
		id: '3',
		clientName: 'Jose Manuel',
		createdAt: getRandomTimestamp(),
		type: getRandomType()
	},
	{
		id: '4',
		clientName: 'Elvira Jasito',
		createdAt: getRandomTimestamp(),
		type: getRandomType()
	},
	{
		id: '5',
		clientName: 'Jane Smith',
		createdAt: getRandomTimestamp(),
		type: getRandomType()
	},
	{
		id: '6',
		clientName: 'Michael Johnson',
		createdAt: getRandomTimestamp(),
		type: getRandomType()
	},
	{
		id: '7',
		clientName: 'Maria Rodriguez',
		createdAt: getRandomTimestamp(),
		type: getRandomType()
	},
	{
		id: '8',
		clientName: 'David Lee',
		createdAt: getRandomTimestamp(),
		type: getRandomType()
	},
	{
		id: '9',
		clientName: 'Sophia Martinez',
		createdAt: getRandomTimestamp(),
		type: getRandomType()
	},
	{
		id: '10',
		clientName: 'Daniel Kim',
		createdAt: getRandomTimestamp(),
		type: getRandomType()
	},
	{
		id: '11',
		clientName: 'Emma Thompson',
		createdAt: getRandomTimestamp(),
		type: getRandomType()
	},
	{
		id: '12',
		clientName: 'Alexander Garcia',
		createdAt: getRandomTimestamp(),
		type: getRandomType()
	}
]

function getRandomTimestamp(): Timestamp {
	// Generate a random timestamp within the last three months
	const threeMonthsAgo = new Date()
	threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
	const timestamp = Math.floor(
		threeMonthsAgo.getTime() + Math.random() * (Date.now() - threeMonthsAgo.getTime())
	)
	return new Timestamp(timestamp / 1000, 0)
}

function getRandomType(): 'RENT' | 'REPAIR' | 'SALE' {
	// Generate a random type
	const types = ['RENT', 'REPAIR', 'SALE']
	const randomIndex = Math.floor(Math.random() * types.length)
	return types[randomIndex] as 'RENT' | 'REPAIR' | 'SALE'
}

const DATA = {
	orders
}
export default DATA
