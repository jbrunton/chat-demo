import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query'

const apiUrl = import.meta.env.VITE_API_URL || ''

export type Room = {
  id: string
  ownerId: string
}

export const useRoom = (roomId: string, accessToken?: string): UseQueryResult<Room> => {
  const queryFn = async (): Promise<Room> => {
    const response = await fetch(`${apiUrl}/rooms/${roomId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data.room as Room
    } else {
      throw new Error(response.statusText)
    }
  }
  return useQuery({
    queryKey: [`rooms/${roomId}`],
    enabled: !!accessToken,
    queryFn,
  })
}

export const useCreateRoom = (onSuccess: (room: Room) => void, accessToken?: string) => {
  return useMutation({
    mutationFn: () =>
      fetch(`${apiUrl}/rooms`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(async (res) => {
        const response = await res.json()
        return response.room
      }),
    onSuccess,
  })
}
