import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { ReactElement } from 'react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { AuthContext, AuthContextInterface } from '../features/auth/context'

export type RenderOptions = {
  routes?: {
    path: string
    initialEntry: string
  }
  auth?: AuthContextInterface
}

const customRender = (ui: ReactElement, opts: RenderOptions = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  const routes = opts.routes ?? { path: '/', initialEntry: '/' }

  const router = createMemoryRouter([{ path: routes.path, element: ui }], {
    initialEntries: [routes.initialEntry],
  })

  const auth: AuthContextInterface = opts.auth ?? { isAuthenticated: false, isLoading: false, signIn: vitest.fn() }

  render(
    <AuthContext.Provider value={auth}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthContext.Provider>,
  )
}

export { customRender as render }
