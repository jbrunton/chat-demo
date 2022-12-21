import { useQuery } from "@tanstack/react-query";

const apiUrl = import.meta.env.VITE_API_URL || "";

export const useGreeting = () =>
  useQuery({
    queryKey: ["greeting"],
    queryFn: () => fetch(apiUrl).then((res) => res.text()),
  });

export const usePrivateGreeting = (accessToken: string) => {
  const url = `${apiUrl}/private-greeting`;
  return useQuery({
    queryKey: ["private-greeting", accessToken],
    queryFn: () =>
      fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => res.text()),
  });
};
