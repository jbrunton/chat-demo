import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from './features/Home'
import { RoomPage } from './features/room/Room'
import { NotFoundPage } from './features/NotFound'
import { NewRoomPage } from './features/room/New'
import { Layout } from './Layout'
import { RequireAuth } from './shared/auth/organisms/require-auth'
import { Callback } from './shared/auth/pages/callback'

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
        path: '/callback',
        element: <Callback />,
      },
      {
        path: '/room/new',
        element: (
          <RequireAuth>
            <NewRoomPage />
          </RequireAuth>
        ),
      },
      {
        path: '/room/:roomId',
        element: (
          <RequireAuth>
            <RoomPage />
          </RequireAuth>
        ),
      },
    ],
  },
])
