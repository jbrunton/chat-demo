import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'

const apiUrl = import.meta.env.VITE_API_URL || ''

export type Message = {
  id: string
  content: string
  time: number
  authorId: string
  roomId: string
  updatedEntities?: string[]
}

export const useMessages = (roomId: string, accessToken?: string) => {
  const queryFn = async () => {
    const response = await fetch(`${apiUrl}/messages/${roomId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data as Message[]
    }
    return []
  }
  return useQuery({
    queryKey: ['messages', roomId],
    enabled: !!accessToken,
    refetchOnWindowFocus: false,
    queryFn,
  })
}

export const useMessagesSubscription = (roomId: string, accessToken?: string) => {
  const queryClient = useQueryClient()
  useEffect(() => {
    if (!accessToken) return

    const eventSource = new EventSourcePolyfill(`${apiUrl}/messages/${roomId}/subscribe`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    eventSource.onmessage = (e) => {
      const { message }: { message: Message } = JSON.parse(e.data)
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
  }, [queryClient, accessToken])
}

export const usePostMessage = (roomId: string, content?: string, accessToken?: string) => {
  return useMutation({
    mutationFn: () =>
      fetch(`${apiUrl}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, roomId }),
      }).then((res) => res.json()),
  })
}
