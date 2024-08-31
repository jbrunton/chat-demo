import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from './features/home'
import { RoomPage } from './features/room/pages/room'
import { NewRoomPage } from './features/room/pages/new'
import { Layout } from './layout'
import { RequireAuth } from './features/auth/organisms/require-auth'
import { Callback } from './features/auth/pages/callback'
import { ErrorPage } from './error-page'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/callback',
        element: <Callback />,
      },
      {
        path: '/room',
        element: <RequireAuth />,
        children: [
          {
            path: 'new',
            element: <NewRoomPage />,
          },
          {
            path: ':roomId',
            element: <RoomPage />,
          },
        ],
      },
    ],
  },
])
