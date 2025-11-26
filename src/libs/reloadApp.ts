import { Platform, NativeModules } from 'react-native'

export const reloadApp = async () => {
  if (Platform.OS === 'web') {
    window?.location?.reload()
    return
  }

  const DevSettings =
    (NativeModules as any)?.DevSettings ?? (global as any)?.DevSettings

  if (typeof DevSettings?.reload === 'function') {
    DevSettings.reload()
    return
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Updates = require('expo-updates')
    if (typeof Updates?.reloadAsync === 'function') {
      await Updates.reloadAsync()
      return
    }
  } catch (error) {
    console.warn('No fue posible recargar totalmente la app', error)
  }

  console.warn('Reload fallback: no se pudo reiniciar la app automáticamente')
}
