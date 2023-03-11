import React from 'react'
import { Box } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { LoadingIndicator } from '../../../shared/molecules/LoadingIndicator'
import { ChatBox } from '../organisms/ChatBox'
import { useMessages, useMessagesSubscription } from '../../../data/messages'
import { MessagesList } from '../organisms/MessagesList'
import { useAuth } from '../../auth'

type Params = {
  roomId: string
}

export const RoomPage = () => {
  const { roomId } = useParams() as Params
  const { data: messages } = useMessages(roomId)
  const { token } = useAuth()

  useMessagesSubscription(roomId, token)

  if (!messages) return <LoadingIndicator />

  return (
    <Box display='flex' flexFlow='column' height='100%' flex='1'>
      {<MessagesList messages={messages} />}
      <ChatBox roomId={roomId} />
    </Box>
  )
}
