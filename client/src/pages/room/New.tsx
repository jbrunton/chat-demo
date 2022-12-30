import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const NewRoomPage = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const roomId = (Math.random() + 1).toString(16).substring(4)
    navigate(`/room/${roomId}`)
  }, [navigate])
  return <></>
}
