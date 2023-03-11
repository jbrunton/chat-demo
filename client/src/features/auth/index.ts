import { useContext } from 'react'
import { AuthContext, AuthContextInterface } from './context'

export const useAuth = (): AuthContextInterface => {
  return useContext(AuthContext)
}
