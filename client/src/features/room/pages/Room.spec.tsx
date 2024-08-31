import React from 'react'
import { screen, waitFor, within } from '@testing-library/react'
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

  it('shows a message if the user lacks permissions to read the room', async () => {
    render(<RoomPage />, {
      path: '/room/:roomId',
      initialEntry: '/room/room:200-can-join',
    })

    await waitFor(() => {
      expect(screen.getByText('You do not have permissions to view messages in this room'))
    })
  })

  it('shows an alert if the user can join the room', async () => {
    render(<RoomPage />, {
      path: '/room/:roomId',
      initialEntry: '/room/room:200-can-join',
    })

    await waitFor(() => {
      const alert = screen.getByRole('alert')
      expect(alert).toHaveTextContent('Join this room to chat.')
      expect(within(alert).getByRole('button')).toHaveTextContent('Join')
    })
  })

  it('shows an alert if the user can request to join', async () => {
    render(<RoomPage />, {
      path: '/room/:roomId',
      initialEntry: '/room/room:300-can-request-approval',
    })

    await waitFor(() => {
      const alert = screen.getByRole('alert')
      expect(alert).toHaveTextContent('Join this room to chat.')
      expect(within(alert).getByRole('button')).toHaveTextContent('Request to Join')
    })
  })

  it('shows an alert if the user requires an invite to join', async () => {
    render(<RoomPage />, {
      path: '/room/:roomId',
      initialEntry: '/room/room:400-requires-invite',
    })

    await waitFor(() => {
      const alert = screen.getByRole('alert')
      expect(alert).toHaveTextContent('You need an invite to join.')
      expect(within(alert).queryByRole('button')).not.toBeInTheDocument()
    })
  })
})
