import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { LoadingIndicator } from '../../molecules/LoadingIndicator'
import { setRedirectPath } from '../pages/callback'

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()

  if (isAuthenticated) {
    return <>{children}</>
  }

  if (!isLoading) {
    setRedirectPath(window.location.pathname)
    loginWithRedirect()
  }

  return <LoadingIndicator />
}
