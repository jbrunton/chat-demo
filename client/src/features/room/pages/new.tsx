import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingIndicator } from '../../../shared/molecules/loading-indicator'
import { useCreateRoom } from '../../../data/rooms'

export const NewRoomPage = () => {
  const navigate = useNavigate()
  const creatingRoom = useRef<boolean>(false)

  const { mutate: createRoom } = useCreateRoom((room) => {
    navigate(`/room/${room.id}`)
  })

  useEffect(() => {
    if (creatingRoom.current) {
      return
    }

    createRoom()
    creatingRoom.current = true
  }, [])

  return <LoadingIndicator />
}
