import React, { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { LoadingIndicator } from '../../../shared/molecules/LoadingIndicator'

const redirectPathKey = 'auth.redirectPath'

export const setRedirectPath = (redirectTo: string): void => {
  localStorage.setItem(redirectPathKey, redirectTo)
}

const popRedirectPath = (): string | null => {
  const redirectTo = localStorage.getItem(redirectPathKey)
  localStorage.removeItem(redirectPathKey)
  return redirectTo
}

export const Callback = () => {
  const { isAuthenticated } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(popRedirectPath() ?? '/')
    }
  }, [isAuthenticated])

  return <LoadingIndicator />
}
