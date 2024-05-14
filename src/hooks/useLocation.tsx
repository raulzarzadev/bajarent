import { useState } from 'react'
import * as Location from 'expo-location'

export type PermissionState = 'granted' | 'denied' | 'prompt'
export type LocationRes = {
  status: PermissionState
  coords: { lat: number; lon: number } | null
  errorMsg: string | null
}
export default function useLocation() {
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState<{
    status: PermissionState
    coords: { lat: number; lon: number } | null
    errorMsg: string | null
  }>(null)

  const getLocation = async (): Promise<LocationRes | null> => {
    setLoading(true)
    try {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status === 'granted') {
        let coords = (await Location.getCurrentPositionAsync({})).coords
        const res: LocationRes = {
          status: 'granted',
          coords: {
            lat: coords.latitude,
            lon: coords.longitude
          },
          errorMsg: null
        }
        setLocation(res)
        setLoading(false)
        return res
      }
      const res: LocationRes = {
        status: 'denied',
        coords: null,
        errorMsg: 'Permission to access location was denied'
      }
      setLocation(res)
      setLoading(false)
      return res
    } catch (error) {
      console.error(error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    location,
    getLocation,
    loading
  }
}
