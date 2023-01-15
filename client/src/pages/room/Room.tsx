import React from 'react'
import { useParams } from 'react-router-dom'
import { MessagesWidget } from '../../components/messages/MessagesWidget'

export const RoomPage = () => {
  const { roomId } = useParams()

  if (!roomId) return <span>Loading</span>

  return <MessagesWidget roomId={roomId} />
}
