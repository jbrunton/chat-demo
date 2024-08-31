import React from 'react'
import { render } from '../../../test/fixtures'
import { waitFor, screen } from '@testing-library/react'
import { getAuthState } from '../../../features/auth/context'
import { Header } from './header'
import userEvent from '@testing-library/user-event'

describe('Header', () => {
  const signIn = vitest.fn()
  const signOut = vitest.fn()

  const getMenuButton = () => screen.getByRole('button', { name: 'Open Menu' })
  const getMenu = () => screen.queryByRole('dialog')
  const getSignInButton = () => screen.getByRole('button', { name: 'Sign In' })
  const getSignOutButton = () => screen.getByRole('button', { name: 'Sign Out Test User' })

  const signedInState = () =>
    getAuthState({ token: 'a1b2c3', isLoading: false, userName: 'Test User', signOut, signIn })
  const signedOutState = () => getAuthState({ isLoading: false, signOut, signIn })

  it('hides the navigation menu by default', () => {
    render(<Header />, { auth: signedOutState() })
    expect(getMenuButton()).toBeVisible()
    expect(getMenu()).not.toBeInTheDocument()
  })

  it('shows the navigation menu when the menu button is clicked', async () => {
    render(<Header />, { auth: signedOutState() })
    await userEvent.click(getMenuButton())
    expect(getMenu()).toBeVisible()
  })

  describe('when signed out', () => {
    it('has a sign in button', async () => {
      // arrange
      render(<Header />, {
        auth: signedOutState(),
      })

      // act
      await userEvent.click(getMenuButton())

      // assert
      await waitFor(() => {
        expect(getSignInButton()).toBeVisible()
      })

      await userEvent.click(getSignInButton())

      expect(signIn).toHaveBeenCalledOnce()
    })
  })

  describe('when signed in', () => {
    it('has a sign out button', async () => {
      // arrange
      render(<Header />, {
        auth: signedInState(),
      })

      // act
      await waitFor(() => {
        expect(getMenuButton()).toBeVisible()
      })

      // assert
      userEvent.click(getMenuButton())

      await waitFor(() => {
        expect(getSignOutButton()).toBeVisible()
      })

      await userEvent.click(getSignOutButton())

      expect(signOut).toHaveBeenCalledOnce()
    })
  })
})
