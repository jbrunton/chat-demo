import { createContext } from 'react'

type LoadingState = {
  isAuthenticated: false
  isLoading: true
  signIn?: never
  signOut?: never
  token?: never
  userName?: never
}

type SignedInState = {
  isAuthenticated: true
  isLoading: false
  signIn?: never
  signOut: () => void
  token: string
  userName?: string
}

type SignedOutState = {
  isAuthenticated: false
  isLoading: false
  signIn: () => void
  signOut?: never
  token?: never
  userName?: never
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

const signedInState = (token: string, userName: string | undefined, signOut: () => void): AuthContextInterface => ({
  isLoading: false,
  isAuthenticated: true,
  signOut,
  token,
  userName,
})

export const AuthContext = createContext<AuthContextInterface>(loadingState)

type GetAuthStateParams = {
  isLoading: boolean
  token?: string
  userName?: string
  signOut: () => void
  signIn: () => void
}

export const getAuthState = ({ isLoading, token, userName, signIn, signOut }: GetAuthStateParams) => {
  if (isLoading) {
    return loadingState
  }

  if (token) {
    return signedInState(token, userName, signOut)
  }

  return signedOutState(signIn)
}
