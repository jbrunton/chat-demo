import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from './pages/Home'
import { RoomPage } from './pages/room/Room'
import { NotFoundPage } from './pages/NotFound'
import { NewRoomPage } from './pages/room/New'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: '/room/new',
    element: <NewRoomPage />,
  },
  {
    path: '/room/:roomId',
    element: <RoomPage />,
  },
])
