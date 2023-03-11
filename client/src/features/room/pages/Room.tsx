import React from 'react'
import { Box } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { LoadingIndicator } from '../../../shared/molecules/LoadingIndicator'
import { ChatBox } from '../organisms/ChatBox'
import { useMessages, useMessagesSubscription } from '../../../data/messages'
import { useAccessToken } from '../../auth/hooks/useAccessToken'
import { MessagesList } from '../organisms/MessagesList'

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
