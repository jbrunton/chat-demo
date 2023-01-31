import React, { useEffect } from 'react'
import { Link as ReactLink, useLocation } from 'react-router-dom'
import {
  Icon,
  Button,
  Flex,
  Heading,
  Spacer,
  HStack,
  useDisclosure,
  IconButton,
  Show,
  DrawerOverlay,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  UseDisclosureProps,
} from '@chakra-ui/react'
import { SignInButton } from './components/organisms/auth/SignInButton'
import { useAuth0 } from '@auth0/auth0-react'
import { useParams } from 'react-router-dom'
import { useAccessToken } from './hooks/useAccessToken'
import { Room, useRoom } from './data/rooms'
import { AiOutlineMenu } from 'react-icons/ai'

export const Header = () => {
  const { isAuthenticated } = useAuth0()
  const { roomId } = useParams()
  const accessToken = useAccessToken()
  const { data: room } = useRoom(roomId, accessToken)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const location = useLocation()
  useEffect(() => {
    if (isOpen) {
      onClose()
    }
  }, [location])

  return (
    <>
      <Flex className='header' p='6px' align='center'>
        <Show below='md'>
          <OpenDrawerButton onOpen={onOpen} />
        </Show>
        <Heading size={{ base: 'sm', lg: 'md' }} noOfLines={1}>
          {room ? room.name : 'Chat Demo'}
        </Heading>
        <Spacer />
        <HStack align='center'>
          <Show above='md'>
            <HeaderMenu room={room} isAuthenticated={isAuthenticated} />
          </Show>
          <SignInButton />
        </HStack>
      </Flex>

      {isOpen ? <DrawerMenu isOpen={isOpen} onClose={onClose} /> : null}
    </>
  )
}

type OpenDrawerButtonProps = Required<Pick<UseDisclosureProps, 'onOpen'>>

const OpenDrawerButton: React.FC<OpenDrawerButtonProps> = ({ onOpen }) => (
  <IconButton
    variant='ghost'
    size={'md'}
    icon={<Icon as={AiOutlineMenu} boxSize={5} />}
    aria-label={'Open Menu'}
    onClick={onOpen}
  />
)

type DrawerMenuProps = Required<Pick<UseDisclosureProps, 'onClose' | 'isOpen'>>

const DrawerMenu: React.FC<DrawerMenuProps> = ({ onClose, isOpen }) => (
  <Drawer placement='top' onClose={onClose} isOpen={isOpen}>
    <DrawerOverlay />
    <DrawerContent>
      <DrawerCloseButton alignSelf='start' />
      <DrawerHeader borderBottomWidth='1px'>Chat Demo</DrawerHeader>
      <DrawerBody>
        <Button as={ReactLink} to='/room/new' variant='ghost'>
          New Room
        </Button>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
)

type HeaderMenuProps = {
  room: Room | undefined
  isAuthenticated: boolean
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ room, isAuthenticated }) => (
  <>
    {room && (
      <Heading size={'md'} noOfLines={1}>
        Chat Demo
      </Heading>
    )}
    {isAuthenticated && (
      <Button as={ReactLink} to='/room/new'>
        New Room
      </Button>
    )}
  </>
)
