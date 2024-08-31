import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { RoomPage } from './Room'
import { render } from '../../../test/fixtures'

describe('RoomPage', () => {
  it('loads messages for the room', async () => {
    render(<RoomPage />, {
      path: '/room/:roomId',
      initialEntry: '/room/room:100-can-manage',
    })

    await waitFor(() => {
      expect(screen.getByText('Hello, World!'))
    })
  })

  it('shows a help message if the user can join the room', async () => {
    render(<RoomPage />, {
      path: '/room/:roomId',
      initialEntry: '/room/room:200-can-join',
    })

    await waitFor(() => {
      expect(screen.getByText('You do not have permissions to view messages in this room'))
    })
  })
})
