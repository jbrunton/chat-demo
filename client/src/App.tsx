import React from 'react'
import { Box, Button, Flex, Heading, Spacer, Link, HStack } from '@chakra-ui/react'
import { SignInButton } from './components/auth/SignInButton'
import { RouterProvider } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { router } from './router'

function App() {
  const { isAuthenticated } = useAuth0()
  return (
    <Box m='2'>
      <Flex mb='2'>
        <Heading>Chat Demo</Heading>
        <Spacer />
        <HStack>
          {isAuthenticated && (
            <Link href='/room/new'>
              <Button>New Room</Button>
            </Link>
          )}
          <SignInButton />
        </HStack>
      </Flex>
      <RouterProvider router={router} />
    </Box>
  )
}

export default App
