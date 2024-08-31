import { Alert, Button, Center, Container, Flex } from '@chakra-ui/react'
import React from 'react'
import { useAuth } from './auth'
import { LoadingIndicator } from '../shared/molecules/loading-indicator'
import { RoomSelector } from '../shared/navigation/organisms/room-selector'

export const HomePage = () => {
  const { isAuthenticated, isLoading, signIn } = useAuth()
  if (isLoading) {
    return <LoadingIndicator />
  }
  return (
    <Center height='100%'>
      <Container maxWidth='container.lg'>
        <Alert status='info' variant='top-accent' p='10'>
          {isAuthenticated ? (
            <Flex flexDirection='column'>
              <RoomSelector />
            </Flex>
          ) : (
            <span>
              <Button variant='link' onClick={signIn}>
                Sign in
              </Button>{' '}
              to get started.
            </span>
          )}
        </Alert>
      </Container>
    </Center>
  )
}
