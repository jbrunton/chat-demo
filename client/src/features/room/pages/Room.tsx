import React from 'react'
import { Box } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { LoadingIndicator } from '../../../shared/molecules/LoadingIndicator'
import { ChatBox } from '../organisms/chat-box'
import { Message, useMessages, useMessagesSubscription } from '../../../data/messages'
import { MessagesList } from '../organisms/messages-list'
import { useRoom } from '../../../data/rooms'
import { can } from '../../../data/lib'

type Params = {
  roomId: string
}

export const RoomPage = () => {
  const { roomId } = useParams() as Params
  const { data: roomResponse } = useRoom(roomId)

  const canRead = can('read', roomResponse)

  const { data: messages, isLoading: isLoadingMessages } = useMessages(roomId, { enabled: canRead })
  useMessagesSubscription(roomId, { enabled: canRead })

  if ((canRead && isLoadingMessages) || !roomResponse) return <LoadingIndicator />

  return (
    <Box display='flex' flexFlow='column' height='100%' flex='1'>
      {<MessagesList messages={messages ?? [restrictedMessage(roomId)]} />}
      <ChatBox roomResponse={roomResponse} />
    </Box>
  )
}

const restrictedMessage = (roomId: string): Message => ({
  id: '0',
  authorId: 'system',
  content: 'You do not have permissions to view messages in this room',
  time: 0,
  roomId,
})
