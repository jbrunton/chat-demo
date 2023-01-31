import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Icon, Button, Menu, MenuButton, MenuItem, MenuList, Spinner, Text, Show } from '@chakra-ui/react'
import { AiOutlineDown } from 'react-icons/ai'
import { DefaultUserIcon } from '../../atoms/icons/User'

export const SignInButton = () => {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0()

  const signIn = () => loginWithRedirect()
  const signOut = () => logout({ returnTo: window.location.origin })

  if (isLoading) {
    return (
      <Button leftIcon={<DefaultUserIcon />}>
        <Spinner />
      </Button>
    )
  }

  if (!isAuthenticated) {
    return <Button onClick={signIn}>Sign In</Button>
  }

  return (
    <Menu>
      <MenuButton as={Button} leftIcon={<DefaultUserIcon />} rightIcon={<Icon as={AiOutlineDown} />}>
        <Text display={{ base: 'none', md: 'inline-flex' }}>{user?.name}</Text>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={signOut}>
          Sign Out
          <Show below='md'>
            <Text>&nbsp;({user?.name})</Text>
          </Show>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
