import React from 'react'
import { Link as ReactLink } from 'react-router-dom'
import { Button, Flex, Heading, Spacer, Link, HStack } from '@chakra-ui/react'
import { SignInButton } from './components/auth/SignInButton'
import { useAuth0 } from '@auth0/auth0-react'
import { useParams } from 'react-router-dom'
import { useAccessToken } from './hooks/useAccessToken'
import { useRoom } from './data/rooms'

export const Header = () => {
  const { isAuthenticated } = useAuth0()
  const { roomId } = useParams()
  const accessToken = useAccessToken()
  const { data: room } = useRoom(roomId, accessToken)
  return (
    <Flex className='header' p='6px'>
      <Heading>{room ? room.name : 'Chat Demo'}</Heading>
      <Spacer />
      <HStack>
        {room && <Heading size={'md'}>Chat Demo</Heading>}
        {isAuthenticated && (
          <Link as={ReactLink} to='/room/new'>
            <Button>New Room</Button>
          </Link>
        )}
        <SignInButton />
      </HStack>
    </Flex>
  )
}
