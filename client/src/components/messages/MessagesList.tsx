import { List, ListIcon, ListItem } from '@chakra-ui/react'
import React from 'react'
import { Message, User } from '../../data/messages'
import { UserIcon } from '../icons/User'

export type MessagesListProps = {
  data: {
    messages: Message[]
    users: User[]
  }
}

export const MessagesList: React.FC<MessagesListProps> = ({ data }) => {
  return (
    <List spacing={3}>
      {data.messages.map((message) => (
        <ListItem key={message.id}>
          <ListIcon as={UserIcon} color='green.500' />
          {message.content}
        </ListItem>
      ))}
    </List>
  )
}
