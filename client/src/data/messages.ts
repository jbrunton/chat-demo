import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'
import axios from 'axios'
import debug from 'debug'
import { apiUrl } from './config'
import { useAuth } from '../features/auth'
import { DefaultQueryOptions, QueryOptions } from './lib'

const log = debug('messages')

export type Message = {
  id: string
  content: string
  time: number
  authorId: string
  roomId: string
  recipientId?: string
  updatedEntities?: string[]
}

const getMessages = async (roomId: string): Promise<Message[]> => {
  const response = await axios.get(`/messages/${roomId}`)
  return response.data
}

export const useMessages = (roomId?: string, opts: QueryOptions = DefaultQueryOptions) => {
  const enabled = opts.enabled && roomId !== undefined
  return useQuery({
    queryKey: ['messages', roomId],
    refetchOnWindowFocus: false,
    enabled,
    queryFn: () => getMessages(roomId ?? ''),
  })
}

export const useMessagesSubscription = (roomId?: string, opts: QueryOptions = DefaultQueryOptions) => {
  const enabled = opts.enabled
  const { token } = useAuth()
  const queryClient = useQueryClient()
  useEffect(() => {
    if (!enabled) return

    const eventSource = new EventSourcePolyfill(`${apiUrl}/messages/${roomId}/subscribe`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    eventSource.onmessage = (e) => {
      const { message }: { message: Message } = JSON.parse(e.data)
      log('message received:', message)
      if (message.updatedEntities?.includes('room')) {
        queryClient.invalidateQueries({ queryKey: ['rooms'] })
      }
      if (message.updatedEntities?.includes('users')) {
        queryClient.invalidateQueries({ queryKey: ['users'] })
      }
      queryClient.setQueryData(['messages', message.roomId], (messages: Message[] | undefined) => {
        if (!messages) return
        return [...messages, message]
      })
    }

    return () => {
      eventSource.close()
    }
  }, [queryClient, token, roomId, enabled])
}

const sendMessage = async (roomId: string, content?: string): Promise<void> => {
  log('sending message', { content, roomId })
  await axios.post('/messages', { content, roomId })
}

export const usePostMessage = (roomId: string, content?: string) => {
  return useMutation({
    mutationFn: () => sendMessage(roomId, content),
  })
}
