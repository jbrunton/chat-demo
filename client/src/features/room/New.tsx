import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingIndicator } from '../../shared/molecules/LoadingIndicator'
import { useCreateRoom } from '../../data/rooms'
import { useAccessToken } from '../../shared/auth/hooks/useAccessToken'

export const NewRoomPage = () => {
  const navigate = useNavigate()
  const accessToken = useAccessToken()

  const { mutate } = useCreateRoom((room) => {
    navigate(`/room/${room.id}`)
  }, accessToken)

  useEffect(() => {
    if (accessToken) {
      mutate()
    }
  }, [accessToken])

  return <LoadingIndicator />
}
