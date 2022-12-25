import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const apiUrl = import.meta.env.VITE_API_URL || "";

export type Message = {
    id: string;
    content: string;
    time: number;
}

export const useMessages = (roomId: string) =>
    useQuery({
        queryKey: [`messages/${roomId}`],
        queryFn: () => fetch(`${apiUrl}/messages/${roomId}`).then((res) => res.json().then(msg => msg as Message[])),
    });

export const usePostMessage = (roomId: string, content?: string, accessToken?: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => fetch(`${apiUrl}/messages`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content, roomId }),
        }).then((res) => res.json()),
        onSuccess: (message) => {
            queryClient.invalidateQueries([`messages/${roomId}`]);
        }
    });
}
