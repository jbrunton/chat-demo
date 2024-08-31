import React, { PropsWithChildren } from 'react'
import { LoadingIndicator } from '../../../shared/molecules/loading-indicator'
import { setRedirectPath } from '../pages/callback'
import { useAuth } from '..'
import { Outlet } from 'react-router-dom'

export const RequireAuth: React.FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, isLoading, signIn } = useAuth()

  if (isAuthenticated) {
    return <>{children ?? <Outlet />}</>
  }

  if (!isLoading) {
    setRedirectPath(window.location.pathname)
    signIn()
  }

  return <LoadingIndicator />
}
