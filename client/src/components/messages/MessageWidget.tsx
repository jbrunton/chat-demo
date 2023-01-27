import { HStack, ListItem, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { Message } from '../../data/messages'
import { useUser } from '../../data/users'
import { useAccessToken } from '../../hooks/useAccessToken'
import { DefaultUserAvatar, SystemAvatar, UserAvatar } from './UserAvatar'

export type MessageWidgetProps = {
  message: Message
}

export const MessageWidget: React.FC<MessageWidgetProps> = ({ message }) => {
  const accessToken = useAccessToken()
  const isSystem = message.authorId === 'system'
  const { data: author } = useUser(message.authorId, accessToken)
  return (
    <ListItem key={message.id}>
      <HStack align='top'>
        {isSystem ? (
          <SystemAvatar />
        ) : author?.picture ? (
          <UserAvatar src={author?.picture} referrerPolicy='no-referrer' />
        ) : (
          <DefaultUserAvatar />
        )}
        <VStack spacing={0} align={'left'}>
          <Text as='b' fontSize='md'>
            {isSystem ? 'System' : author?.name}
          </Text>
          <Text dangerouslySetInnerHTML={{ __html: message.content }} />
        </VStack>
      </HStack>
    </ListItem>
  )
}
