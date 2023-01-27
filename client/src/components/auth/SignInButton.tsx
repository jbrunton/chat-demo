import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Icon, Button, Menu, MenuButton, MenuItem, MenuList, Spinner } from '@chakra-ui/react'
import { AiOutlineDown } from 'react-icons/ai'
import { UserIcon } from '../icons/User'

export const SignInButton = () => {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0()

  const signIn = () => loginWithRedirect()
  const signOut = () => logout({ returnTo: window.location.origin })

  if (isLoading) {
    return (
      <Button leftIcon={<UserIcon />}>
        <Spinner />
      </Button>
    )
  }

  if (!isAuthenticated) {
    return <Button onClick={signIn}>Sign In</Button>
  }

  return (
    <Menu>
      <MenuButton as={Button} leftIcon={<UserIcon />} rightIcon={<Icon as={AiOutlineDown} />}>
        {user?.name}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={signOut}>Sign Out</MenuItem>
      </MenuList>
    </Menu>
  )
}
