import { createContext } from 'react'

type LoadingState = {
  isAuthenticated: false
  isLoading: true
  signIn?: never
  signOut?: never
  token?: never
}

type SignedInState = {
  isAuthenticated: true
  isLoading: false
  signIn?: never
  signOut: () => void
  token: string
}

type SignedOutState = {
  isAuthenticated: false
  isLoading: false
  signIn: () => void
  signOut?: never
  token?: never
}

export type AuthContextInterface = LoadingState | SignedInState | SignedOutState

const loadingState: AuthContextInterface = {
  isLoading: true,
  isAuthenticated: false,
}

const signedOutState = (signIn: () => void): AuthContextInterface => ({
  isLoading: false,
  isAuthenticated: false,
  signIn,
})

const signedInState = (token: string, signOut: () => void): AuthContextInterface => ({
  isLoading: false,
  isAuthenticated: true,
  signOut,
  token,
})

export const AuthContext = createContext<AuthContextInterface>(loadingState)

type GetAuthStateParams = {
  isLoading: boolean
  token?: string
  signOut: () => void
  signIn: () => void
}

export const getAuthState = ({ isLoading, token, signIn, signOut }: GetAuthStateParams) => {
  if (isLoading) {
    return loadingState
  }

  if (token) {
    return signedInState(token, signOut)
  }

  return signedOutState(signIn)
}
