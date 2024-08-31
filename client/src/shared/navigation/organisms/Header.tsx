import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  useDisclosure,
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
import { RoomSelector } from './RoomSelector'
import { useAuth } from '../../../features/auth'
import { HeaderTemplate } from '../molecules/HeaderTemplate'

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
      <HeaderTemplate title={roomResponse?.room.name ?? 'Chat Demo'} onOpen={onOpen} />

      {isOpen ? <DrawerMenu isOpen={isOpen} onClose={onClose} isAuthenticated={isAuthenticated} /> : null}
    </>
  )
}

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
