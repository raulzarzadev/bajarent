import { set } from 'date-fns'
import { useEffect, useState } from 'react'

export default function useLocation() {
  const [location, setLocation] = useState<[number, number]>([0, 0])
  const [locationEnabled, setLocationEnabled] = useState(false)
  const [showButton, setShowButton] = useState(false)
  useEffect(() => {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      console.log(result.state)
      if (result.state === 'granted') {
        setLocationEnabled(true)
      } else if (result.state === 'prompt') {
        setLocationEnabled(false)
        setShowButton(true)
      } else if (result.state === 'denied') {
        setLocationEnabled(false)
      }
    })

    getCurrentPosition().then((position) => {
      if (!position) return
      setLocation([position.coords.latitude, position.coords.longitude])
    })
  }, [])
  const getCurrentPosition = () => {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      })
    })
  }

  const askLocation = async (): Promise<[number, number] | null> => {
    try {
      const position = await getCurrentPosition()
      return [position.coords.latitude, position.coords.longitude]
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
