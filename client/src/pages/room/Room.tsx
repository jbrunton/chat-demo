import React from 'react'
import { useParams } from 'react-router-dom'
import { ChatWidget } from '../../components/messages/ChatWidget'

type Params = {
  roomId: string
}

export const RoomPage = () => {
  const { roomId } = useParams() as Params
  return (
    <>
      <ChatWidget roomId={roomId} />
    </>
  )
}
