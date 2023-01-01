import { List, ListIcon, ListItem } from '@chakra-ui/react'
import React from 'react'
import { Message, User } from '../../data/messages'
import { UserIcon } from '../icons/User'

export type MessagesListProps = {
  data: {
    messages: Message[]
    authors: Record<string, User>
  }
}

export const MessagesList: React.FC<MessagesListProps> = ({ data: { messages, authors } }) => {
  return (
    <List spacing={3}>
      {messages.map((message) => {
        const author = authors[message.authorId]
        return (
          <ListItem key={message.id}>
            <ListIcon as={UserIcon} color='green.500' />
            <span>{author?.name ?? 'Anon'}: </span>
            {message.content}
          </ListItem>
        )
      })}
    </List>
  )
}
