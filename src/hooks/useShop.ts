import { useSelector } from 'react-redux'
import { selectShop } from '../state/features/shop/shopSlice'
import { useAuth } from '../contexts/authContext'
import { useEmployee } from '../contexts/employeeContext'

export const useShop = () => {
  const { shop } = useSelector(selectShop)
  const { user } = useAuth()
  const myAsEmployee = shop?.staff.find((s) => s.id === user?.id) || null
  console.log({ myAsEmployee })
  const { employee } = useEmployee()
  console.log({ employee })
  return { shop }
}
