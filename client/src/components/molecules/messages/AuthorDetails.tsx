import React from 'react'
import { HStack, Text } from '@chakra-ui/react'
import { format } from 'date-fns'
import { Message } from '../../../data/messages'
import { User } from '../../../data/users'

export type AuthorDetailsProps = {
  author: User | undefined
  message: Message
}

export const AuthorDetails: React.FC<AuthorDetailsProps> = ({ author, message }) => {
  const isSystem = author?.id === 'system'
  const isPrivate = message?.recipientId !== undefined
  return (
    <HStack alignItems='baseline'>
      <Text as='b' fontSize='md'>
        {isSystem ? 'System' : author?.name}
      </Text>
      <Text fontSize='xs' color='gray'>
        {format(message?.time, 'hh:mm b')}
      </Text>
      {isPrivate && (
        <Text as='em' color='gray' fontSize='xs'>
          Only visible to you
        </Text>
      )}
    </HStack>
  )
}
