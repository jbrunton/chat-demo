import React, { ReactNode } from 'react'
import { Alert, AlertIcon, Spacer } from '@chakra-ui/react'
import { ReactElement } from 'react'

type RoomInfoAlertProps = {
  children: ReactNode
  rightButton?: ReactElement
}

export const RoomInfoAlert = ({ rightButton, children }: RoomInfoAlertProps): ReactElement => (
  <Alert status='info' variant='top-accent'>
    <AlertIcon />
    {children}
    <Spacer />
    {rightButton}
  </Alert>
)
