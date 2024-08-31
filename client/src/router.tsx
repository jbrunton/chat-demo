import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from './features/home'
import { RoomPage } from './features/room/pages/room'
import { NotFoundPage } from './shared/pages/NotFound'
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
