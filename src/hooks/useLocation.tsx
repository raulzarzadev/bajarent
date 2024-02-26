import { useEffect, useState } from 'react'

export type PermissionState = 'granted' | 'denied' | 'prompt'

export default function useLocation() {
  const [location, setLocation] = useState<[number, number]>([0, 0])
  const [locationEnabled, setLocationEnabled] = useState(false)
  const [showButton, setShowButton] = useState(false)

  const setLocationStatus = (status: PermissionState) => {
    setLocationEnabled(status === 'granted')
  }
  useEffect(() => {
    if (navigator)
      navigator?.permissions
        ?.query({ name: 'geolocation' })
        .then((permissionsStatus) => {
          setLocationStatus(permissionsStatus.state)
          permissionsStatus.onchange = function () {
            const state = this.state
            console.log('geolocation permission changed', state)
            setLocationStatus(state)
          }
        })

    getCurrentPosition().then((position) => {
      if (!position) return
      // @ts-ignore
      setLocation([position?.coords?.latitude, position?.coords?.longitude])
    })
  }, [])

  const getCurrentPosition = () => {
    if ('geoloaction' in navigator) {
      // @ts-ignore
      return new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000
        })
      })
    } else {
      return new Promise((resolve, reject) => {
        reject(new Error('Geolocation is not supported by this browser.'))
      })
    }
  }

  const askLocation = async (): Promise<[number, number] | null> => {
    try {
      const position = await getCurrentPosition()
      // @ts-ignore
      return [position?.coords?.latitude, position?.coords?.longitude]
    } catch (error) {
      console.error(error)
      return null
    }
  }
  return {
    locationEnabled,
    showButton,
    location,
    askLocation
  }
}
