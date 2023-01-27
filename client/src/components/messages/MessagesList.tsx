import { Box, List, Text } from '@chakra-ui/react'
import React from 'react'
import { Message } from '../../data/messages'
import { MessagesGroup, MessagesGroupProps } from './MessageGroup'

export type MessagesListProps = {
  messages: Message[]
}

export const MessagesList: React.FC<MessagesListProps> = ({ messages }) => {
  const messageGroups = groupMessages(messages)
  if (messageGroups.length === 0) {
    return (
      <Box padding='6px'>
        <Text as='em' fontSize='sm'>
          Be the first person to say something
        </Text>
      </Box>
    )
  }
  return (
    <List spacing={3}>
      {messageGroups.map((params, index) => (
        <MessagesGroup key={`group-${index}`} {...params} />
      ))}
    </List>
  )
}

const groupMessages = (messages: Message[]): MessagesGroupProps[] => {
  const sameGroup = (msg1: Message, msg2: Message): boolean =>
    msg1.authorId === msg2.authorId && msg1.recipientId === msg2.recipientId

  return messages.reduce((groups: MessagesGroupProps[], message: Message) => {
    const currentGroup = groups[groups.length - 1]
    const lastMessage = currentGroup?.messages[0]
    if (lastMessage && sameGroup(message, lastMessage)) {
      currentGroup.messages.push(message)
    } else {
      groups.push({
        authorId: message.authorId,
        messages: [message],
      })
    }
    return groups
  }, [])
}
