import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { ReactElement } from 'react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

export type RenderOptions = {
  path: string
  initialEntry: string
}

const customRender = (ui: ReactElement, opts: RenderOptions | undefined) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  const router = opts
    ? createMemoryRouter([{ path: opts.path, element: ui }], {
        initialEntries: [opts.initialEntry],
      })
    : undefined
  render(
    <QueryClientProvider client={queryClient}>{router ? <RouterProvider router={router} /> : ui}</QueryClientProvider>,
  )
}

export { customRender as render }
