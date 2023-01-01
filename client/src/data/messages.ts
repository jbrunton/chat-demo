import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const apiUrl = import.meta.env.VITE_API_URL || ''

export type Message = {
  id: string
  content: string
  time: number
}

export type User = {
  id: string
  name: string
  picture: string
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
      return data as { messages: Message[]; users: User[] }
    }
    return {
      messages: [],
      users: [],
    }
  }
  return useQuery({
    queryKey: [`messages/${roomId}`],
    enabled: !!accessToken,
    queryFn,
  })
}

export const usePostMessage = (roomId: string, content?: string, accessToken?: string) => {
  const queryClient = useQueryClient()
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
    onSuccess: () => {
      queryClient.invalidateQueries([`messages/${roomId}`])
    },
  })
}
