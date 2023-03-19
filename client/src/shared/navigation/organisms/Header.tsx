import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Icon,
  Flex,
  Heading,
  Spacer,
  HStack,
  useDisclosure,
  IconButton,
  DrawerOverlay,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  UseDisclosureProps,
  Divider,
} from '@chakra-ui/react'
import { SignInButton } from '../../../features/auth/organisms/sign-in-button'
import { useParams } from 'react-router-dom'
import { useRoom } from '../../../data/rooms'
import { AiOutlineMenu } from 'react-icons/ai'
import { RoomSelector } from './RoomSelector'
import { useAuth } from '../../../features/auth'

export const Header = () => {
  const { isAuthenticated, isLoading: isLoadingAuth } = useAuth()
  const { roomId } = useParams()
  const { data: roomResponse } = useRoom(roomId, { enabled: !isLoadingAuth })

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
        <Heading size={{ base: 'sm', lg: 'md' }} noOfLines={1}>
          {roomResponse?.room.name ?? 'Chat Demo'}
        </Heading>
        <Spacer />
        <HStack align='center'>
          <IconButton variant='ghost' icon={<DrawerIcon />} aria-label={'Open Menu'} onClick={onOpen} />
        </HStack>
      </Flex>

      {isOpen ? <DrawerMenu isOpen={isOpen} onClose={onClose} isAuthenticated={isAuthenticated} /> : null}
    </>
  )
}

const DrawerIcon = () => <Icon as={AiOutlineMenu} boxSize={5} />

type DrawerMenuProps = Required<Pick<UseDisclosureProps, 'onClose' | 'isOpen'>> & {
  isAuthenticated: boolean
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({ onClose, isOpen, isAuthenticated }) => (
  <Drawer placement='right' size='md' onClose={onClose} isOpen={isOpen}>
    <DrawerOverlay />
    <DrawerContent>
      <DrawerCloseButton alignSelf='start' />
      <DrawerHeader borderBottomWidth='1px'>Chat Demo</DrawerHeader>
      <DrawerBody>
        <SignInButton />
        {isAuthenticated && (
          <>
            <Divider my='2' />
            <RoomSelector />
          </>
        )}
      </DrawerBody>
    </DrawerContent>
  </Drawer>
)
