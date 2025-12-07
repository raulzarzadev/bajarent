export function flattenValues(data: any): (string | number)[] {
	let result: (string | number)[] = []
	const itemId = data?.id || null
	if (itemId) result = [`${itemId}`] //<-- put the id Item in the array at very first
	if (Array.isArray(data)) {
		// Si es un array, iteramos sobre sus elementos y los aplanamos
		for (const item of data) {
			result = result.concat(flattenValues(item))
		}
	} else if (typeof data === 'object' && data !== null) {
		// Si es un objeto, iteramos sobre sus claves y aplanamos los valores
		for (const key in data) {
			if (data.hasOwnProperty(key)) {
				result = result.concat(flattenValues(data[key]))
			}
		}
	} else {
		// Si es un valor primitivo, lo agregamos directamente
		result.push(data)
	}

	return result
}

export function processData(a: any): string {
	return flattenValues(a)
		.filter(i => !!i && (typeof i === 'string' || typeof i === 'number'))
		.join(' ')
}

// Ejemplo de uso:
// const a = {
//   name: 'Juan',
//   address: {
//     street: 'Av. Reforma',
//     number: 123,
//     details: ['Apto 5', { floor: '3rd', door: 'B' }]
//   },
//   contacts: ['+5255433899452', { type: 'mobile', number: '+524455667788' }],
//   age: 30
// }

//console.log(processData(a)) // Juan Av. Reforma 123 Apto 5 3rd B +5255433899452 mobile +524455667788 30
