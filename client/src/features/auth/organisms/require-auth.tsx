import React from 'react'
import { LoadingIndicator } from '../../../shared/molecules/loading-indicator'
import { setRedirectPath } from '../pages/callback'
import { useAuth } from '..'

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, signIn } = useAuth()

  if (isAuthenticated) {
    return <>{children}</>
  }

  if (!isLoading) {
    setRedirectPath(window.location.pathname)
    signIn()
  }

  return <LoadingIndicator />
}
