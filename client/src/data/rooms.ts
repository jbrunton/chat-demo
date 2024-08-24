import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import axios from 'axios'
import { DefaultQueryOptions, QueryOptions } from './lib'

export type Room = {
  id: string
  ownerId: string
  name: string
  joinPolicy: string
}

export type Membership = {
  roomId: string
  status: string
}

export type RoomResponse = {
  room: Room
  roles: string[]
  membership?: Membership
}

const getRoom = async (roomId?: string): Promise<RoomResponse> => {
  const response = await axios.get(`/rooms/${roomId}`)
  return response.data
}

export const useRoom = (roomId?: string, opts: QueryOptions = DefaultQueryOptions): UseQueryResult<RoomResponse> => {
  const enabled = opts.enabled && roomId !== undefined
  return useQuery({
    queryKey: ['rooms', roomId],
    enabled,
    queryFn: () => getRoom(roomId),
  })
}

const createRoom = async (): Promise<Room> => {
  const response = await axios.post('/rooms')
  return response.data.room
}

export const useCreateRoom = (onSuccess: (room: Room) => void) => {
  return useMutation({
    mutationFn: () => createRoom(),
    onSuccess,
  })
}

const joinRoom = async (roomId: string) => {
  await axios.post(`/rooms/${roomId}/join`)
}

export const useJoinRoom = (roomId: string) => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: () => joinRoom(roomId),
    onSuccess: () => {
      client.invalidateQueries(['me'])
    },
  })
}
