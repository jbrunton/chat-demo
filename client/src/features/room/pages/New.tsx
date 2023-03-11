import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingIndicator } from '../../../shared/molecules/LoadingIndicator'
import { useCreateRoom } from '../../../data/rooms'

export const NewRoomPage = () => {
  const navigate = useNavigate()

  const { mutate: createRoom } = useCreateRoom((room) => {
    navigate(`/room/${room.id}`)
  })

  useEffect(() => {
    createRoom()
  }, [])

  return <LoadingIndicator />
}
