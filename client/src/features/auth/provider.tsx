import React, { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { clearBearerToken, setBearerToken } from '../../data/config'
import { AuthContext, getAuthState } from './context'
import { useAccessToken } from './hooks/use-access-token'
import debug from 'debug'

const log = debug('auth')

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading: isAuth0Loading, loginWithRedirect, logout, user } = useAuth0()
  const { accessToken, isLoading: isTokenLoading } = useAccessToken()
  const [isLoading, setIsLoading] = useState(true)

  log('AuthProvider', { isLoading, accessToken })

  useEffect(() => {
    if (isAuth0Loading || isTokenLoading) return

    setIsLoading(false)

    if (accessToken) {
      setBearerToken(accessToken)
    }
  }, [accessToken, isAuth0Loading, isTokenLoading])

  const signOut = () => {
    log('signOut called')
    setIsLoading(true)
    clearBearerToken()
    logout({ returnTo: window.location.origin })
  }

  const signIn = () => {
    log('signIn called')
    setIsLoading(true)
    loginWithRedirect()
  }

  const state = getAuthState({
    isLoading,
    token: accessToken,
    userName: user?.name,
    signIn,
    signOut,
  })

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}
