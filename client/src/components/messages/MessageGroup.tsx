import React from 'react'
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
          <HStack>
            <Text as='b' fontSize='md'>
              {isSystem ? 'System' : author?.name}
            </Text>
            {isPrivate && (
              <Text as='em' color='gray' fontSize='sm'>
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
