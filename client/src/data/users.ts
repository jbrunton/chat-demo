import { useQuery, UseQueryResult } from '@tanstack/react-query'
import axios from 'axios'
import { Room } from './rooms'

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

const getUser = async (userId: string): Promise<User> => {
  const response = await axios.get(`/users/${userId}`)
  return response.data
}

const getSignedInUser = async (): Promise<User> => {
  const response = await axios.get(`/users/me`)
  return response.data
}

export const useUser = (userId: string): UseQueryResult<User> =>
  useQuery({
    queryKey: userQueryKey(userId),
    queryFn: () => getUser(userId),
  })

export const useUserDetails = (): UseQueryResult<UserDetailsResponse> =>
  useQuery({
    queryKey: ['me'],
    queryFn: () => getSignedInUser(),
  })
