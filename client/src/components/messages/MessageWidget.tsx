import { ListIcon, ListItem } from '@chakra-ui/react'
import React from 'react'
import { Message } from '../../data/messages'
import { useUser } from '../../data/users'
import { useAccessToken } from '../../hooks/useAccessToken'
import { UserIcon } from '../icons/User'

export type MessageWidgetProps = {
  message: Message
}

export const MessageWidget: React.FC<MessageWidgetProps> = ({ message }) => {
  const accessToken = useAccessToken()
  const isSystem = message.authorId === 'system'
  const { data: author } = useUser(message.authorId, accessToken)
  return (
    <ListItem key={message.id}>
      <ListIcon as={UserIcon} color='green.500' />
      <span>{isSystem ? 'System' : author?.name ?? 'Loading...'}: </span>
      <div dangerouslySetInnerHTML={{ __html: message.content }} />
    </ListItem>
  )
}
