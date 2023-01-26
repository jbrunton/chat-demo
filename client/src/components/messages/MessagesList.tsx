import { List } from '@chakra-ui/react'
import React from 'react'
import { Message } from '../../data/messages'
import { MessageWidget } from './MessageWidget'

export type MessagesListProps = {
  messages: Message[]
}

export const MessagesList: React.FC<MessagesListProps> = ({ messages }) => {
  return (
    <List spacing={3}>
      {messages.map((message) => (
        <MessageWidget message={message} key={message.id} />
      ))}
    </List>
  )
}
