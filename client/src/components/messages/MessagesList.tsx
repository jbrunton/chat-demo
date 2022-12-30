import { List, ListIcon, ListItem } from '@chakra-ui/react'
import React from 'react'
import { Message } from '../../data/messages'
import { UserIcon } from '../icons/User'

export type MessagesListProps = {
  messages: Message[]
}

export const MessagesList: React.FC<MessagesListProps> = ({ messages }) => {
  return (
    <List spacing={3}>
      {messages.map((message) => (
        <ListItem key={message.id}>
          <ListIcon as={UserIcon} color='green.500' />
          {message.content}
        </ListItem>
      ))}
    </List>
  )
}
