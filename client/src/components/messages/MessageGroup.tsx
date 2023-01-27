import { HStack, ListItem, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { Message } from '../../data/messages'
import { useUser } from '../../data/users'
import { useAccessToken } from '../../hooks/useAccessToken'
import { DefaultUserAvatar, SystemAvatar, UserAvatar } from './UserAvatar'

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
        <VStack spacing={0} align={'left'}>
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
          {messages.map((message) => (
            <Text key={message.id} dangerouslySetInnerHTML={{ __html: message.content }} />
          ))}
        </VStack>
      </HStack>
    </ListItem>
  )
}
