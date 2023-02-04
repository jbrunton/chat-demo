import React from 'react'
import { Box } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { LoadingIndicator } from '../../components/molecules/LoadingIndicator'
import { ChatBox } from '../../components/organisms/messages/ChatBox'
import { MessagesList } from '../../components/organisms/messages/MessagesList'
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
    <Box display='flex' flexFlow='column' height='100%' flex='1'>
      {<MessagesList messages={messages} />}
      <ChatBox roomId={roomId} />
    </Box>
  )
}
