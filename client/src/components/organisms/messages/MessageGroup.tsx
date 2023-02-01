import React from 'react'
import { HStack, ListItem, VStack } from '@chakra-ui/react'
import { Message } from '../../../data/messages'
import { useUser } from '../../../data/users'
import { useAccessToken } from '../../../hooks/useAccessToken'
import { FormattedMessage } from '../../molecules/messages/FormattedMessage'
import { AuthorDetails } from '../../molecules/messages/AuthorDetails'
import { AuthorAvatar } from '../../molecules/messages/AuthorAvatar'

export type MessagesGroupProps = {
  authorId: string
  messages: Message[]
}

export const MessagesGroup: React.FC<MessagesGroupProps> = ({ messages, authorId }) => {
  const accessToken = useAccessToken()
  const isPrivate = !!messages[0].recipientId
  const { data: author } = useUser(authorId, accessToken)
  return (
    <ListItem backgroundColor={isPrivate ? 'gray.50' : undefined} borderRadius='6px'>
      <HStack align='top'>
        <AuthorAvatar author={author} />
        <VStack spacing={0} align={'left'} w='full'>
          <AuthorDetails author={author} message={messages[0]} />
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
