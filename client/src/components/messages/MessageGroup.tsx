import React from 'react'
import { format } from 'date-fns'
import { HStack, ListItem, Text, VStack } from '@chakra-ui/react'
import { Message } from '../../data/messages'
import { useUser } from '../../data/users'
import { useAccessToken } from '../../hooks/useAccessToken'
import { DefaultUserAvatar, SystemAvatar, UserAvatar } from './UserAvatar'
import { FormattedMessage } from './FormattedMessage'

export type MessagesGroupProps = {
  authorId: string
  messages: Message[]
}

export const MessagesGroup: React.FC<MessagesGroupProps> = ({ messages, authorId }) => {
  const accessToken = useAccessToken()
  const isSystem = authorId === 'system'
  const isPrivate = !!messages[0].recipientId
  const { data: author } = useUser(authorId, accessToken)
  return (
    <ListItem backgroundColor={isPrivate ? 'gray.50' : undefined} borderRadius='6px'>
      <HStack align='top'>
        {isSystem ? (
          <SystemAvatar />
        ) : author?.picture ? (
          <UserAvatar src={author?.picture} referrerPolicy='no-referrer' />
        ) : (
          <DefaultUserAvatar />
        )}
        <VStack spacing={0} align={'left'} w='full'>
          <HStack alignItems='baseline'>
            <Text as='b' fontSize='md'>
              {isSystem ? 'System' : author?.name}
            </Text>
            <Text fontSize='xs' color='gray'>
              {format(messages[0].time, 'hh:mm b')}
            </Text>
            {isPrivate && (
              <Text as='em' color='gray' fontSize='xs'>
                Only visible to you
              </Text>
            )}
          </HStack>
          <VStack align={'left'}>
            {messages.map((message) => (
              <FormattedMessage key={message.id} content={message.content} />
            ))}
          </VStack>
        </VStack>
      </HStack>
    </ListItem>
  )
}
