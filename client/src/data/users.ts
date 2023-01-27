import { useQuery, UseQueryResult } from '@tanstack/react-query'

const apiUrl = import.meta.env.VITE_API_URL || ''

export type User = {
  id: string
  name: string
  picture: string
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
