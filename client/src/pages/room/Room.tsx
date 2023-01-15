import React from 'react'
import { useParams } from 'react-router-dom'
import { MessagesWidget } from '../../components/messages/MessagesWidget'

export const RoomPage = () => {
  const { clientRoomId } = useParams()

  if (!clientRoomId) return <span>Loading</span>

  const roomId = `Room#${clientRoomId}`
  return <MessagesWidget roomId={roomId} />
}
