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

  console.warn('Reload fallback: no se pudo reiniciar la app automáticamente')
}
