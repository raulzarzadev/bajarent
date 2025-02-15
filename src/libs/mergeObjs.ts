export const mergeObjs = (obj1: any, changes: any) => {
  const result = { ...obj1 }

  mergeDeep(result, '', changes)
  return result
}

// Función recursiva para manejar objetos anidados
const mergeDeep = (current: any, path: string, value: any) => {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    Object.entries(value).forEach(([key, val]) => {
      const newPath = path ? `${path}.${key}` : key
      mergeDeep(current, newPath, val)
    })
  } else {
    // Manejar la asignación del valor usando la notación de puntos
    if (path.includes('.')) {
      const keys = path.split('.')
      let currentObj = current

      // Navegar hasta el penúltimo nivel
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i]
        if (!currentObj[k]) {
          currentObj[k] = {}
        }
        currentObj = currentObj[k]
      }

      // Asignar el valor al último nivel
      const lastKey = keys[keys.length - 1]
      currentObj[lastKey] = value
    } else {
      current[path] = value
    }
  }
}
