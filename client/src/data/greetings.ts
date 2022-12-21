import { useQuery } from "@tanstack/react-query";

const apiUrl = import.meta.env.VITE_API_URL || "";

export const useGreeting = () =>
  useQuery({
    queryKey: ["greeting"],
    queryFn: () => fetch(`${apiUrl}/greeting`).then((res) => res.text()),
  });

export const usePrivateGreeting = (accessToken: string) => useQuery({
    queryKey: ["private-greeting", accessToken],
    queryFn: () =>
      fetch(`${apiUrl}/private-greeting`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => res.text()),
  });

