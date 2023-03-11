import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Button, Spinner } from '@chakra-ui/react'
import { AiOutlineLogout } from 'react-icons/ai'
import { DefaultUserIcon } from '../../room/atoms/DefaultUserIcon'

export const SignInButton = () => {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0()

  const signIn = () => loginWithRedirect()
  const signOut = () => logout({ returnTo: window.location.origin })

  if (isLoading) {
    return (
      <Button variant='drawer' leftIcon={<DefaultUserIcon />}>
        <Spinner />
      </Button>
    )
  }

  if (!isAuthenticated) {
    return (
      <Button variant='drawer' onClick={signIn}>
        Sign In
      </Button>
    )
  }

  return (
    <Button leftIcon={<AiOutlineLogout />} variant='drawer' onClick={signOut}>
      Sign Out {user?.name}
    </Button>
  )
}
