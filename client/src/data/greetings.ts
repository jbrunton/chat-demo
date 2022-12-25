import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const apiUrl = import.meta.env.VITE_API_URL || "";

export const useGreeting = () =>
  useQuery({
    queryKey: ["greeting"],
    queryFn: () => fetch(`${apiUrl}/greeting`).then((res) => res.text()),
  });

export const usePrivateGreeting = (accessToken?: string) => useQuery({
    queryKey: ["private-greeting", accessToken],
    enabled: !!accessToken,
    queryFn: () =>
      fetch(`${apiUrl}/private-greeting`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => res.text()),
  });

export const useCustomGreeting = (greeting: string, accessToken?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => fetch(`${apiUrl}/custom-greeting`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ greeting }),
    }).then((res) => res.text()),
    onSuccess: (greeting) => {
      queryClient.setQueryData(['private-greeting', accessToken], greeting);
    }
  });
}
