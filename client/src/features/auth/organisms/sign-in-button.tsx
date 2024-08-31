import React from 'react'
import { Button, Spinner } from '@chakra-ui/react'
import { AiOutlineLogout } from 'react-icons/ai'
import { DefaultUserIcon } from '../../room/atoms/default-user-icon'
import { useAuth } from '..'

export const SignInButton = () => {
  const { isAuthenticated, isLoading, signIn, signOut, userName } = useAuth()

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
      Sign Out {userName}
    </Button>
  )
}
