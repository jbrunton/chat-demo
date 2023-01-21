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
}

export type User = {
  id: string
  name: string
  picture: string
}

type RoomResponse = { messages: Message[]; authors: Record<string, User> }

export const useMessages = (roomId: string, accessToken?: string) => {
  const queryFn = async () => {
    const response = await fetch(`${apiUrl}/messages/${roomId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data as RoomResponse
    }
    return {
      messages: [],
      authors: {},
    }
  }
  return useQuery({
    queryKey: [`messages/${roomId}`],
    enabled: !!accessToken,
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
      const { message, author }: { message: Message; author: User } = JSON.parse(e.data)
      queryClient.setQueryData([`messages/${message.roomId}`], (response: RoomResponse | undefined) => {
        if (!response) return
        const messages = [...response.messages, message]
        const authors = response.authors[author.id]
          ? response.authors
          : {
              ...response.authors,
              [author.id]: author,
            }
        return {
          messages,
          authors,
        }
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
      fetch(`${apiUrl}/messages/${roomId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      }).then((res) => res.json()),
  })
}
