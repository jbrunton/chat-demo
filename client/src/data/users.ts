import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Room } from './rooms'

const apiUrl = import.meta.env.VITE_API_URL || ''

export type User = {
  id: string
  name: string
  picture: string
}

export type UserDetailsResponse = {
  user: User
  rooms: Room[]
}

export const userQueryKey = (userId: string) => ['users', userId]

export const useUser = (userId: string, accessToken?: string): UseQueryResult<User> => {
  const queryFn = async (): Promise<User> => {
    const response = await fetch(`${apiUrl}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data as User
    } else {
      throw new Error(response.statusText)
    }
  }
  return useQuery({
    queryKey: userQueryKey(userId),
    enabled: !!accessToken,
    queryFn,
  })
}

export const useUserDetails = (accessToken?: string): UseQueryResult<UserDetailsResponse> => {
  const queryFn = async (): Promise<User> => {
    const response = await fetch(`${apiUrl}/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data as User
    } else {
      throw new Error(response.statusText)
    }
  }
  return useQuery({
    queryKey: ['me'],
    enabled: !!accessToken,
    queryFn,
  })
}
