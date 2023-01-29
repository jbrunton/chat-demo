import React from 'react'
import { Box } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { LoadingIndicator } from '../../components/LoadingIndicator'
import { ChatBox } from '../../components/messages/ChatBox'
import { MessagesList } from '../../components/messages/MessagesList'
import { useMessages, useMessagesSubscription } from '../../data/messages'
import { useAccessToken } from '../../hooks/useAccessToken'

type Params = {
  roomId: string
}

export const RoomPage = () => {
  const { roomId } = useParams() as Params
  const accessToken = useAccessToken()
  const { data: messages } = useMessages(roomId, accessToken)

  useMessagesSubscription(roomId, accessToken)

  if (!messages) return <LoadingIndicator />

  return (
    <Box display='flex' flexFlow='column' height='100%'>
      {<MessagesList messages={messages} />}
      <ChatBox roomId={roomId} />
    </Box>
  )
}
