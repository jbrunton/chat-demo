import React from 'react'
import { HStack, ListItem, VStack } from '@chakra-ui/react'
import { Message } from '../../../data/messages'
import { useUser } from '../../../data/users'
import { AuthorAvatar } from '../molecules/author-avatar'
import { AuthorDetails } from '../molecules/author-details'
import { FormattedMessage } from '../molecules/formatted-message'

export type MessagesGroupProps = {
  authorId: string
  messages: Message[]
}

export const MessagesGroup: React.FC<MessagesGroupProps> = ({ messages, authorId }) => {
  const isPrivate = !!messages[0].recipientId
  const { data: author } = useUser(authorId)
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
