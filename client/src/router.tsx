import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from './features/Home'
import { RoomPage } from './features/room/Room'
import { NotFoundPage } from './features/NotFound'
import { NewRoomPage } from './features/room/New'
import { Layout } from './Layout'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
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
    ],
  },
])
