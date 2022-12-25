import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

export const useAccessToken = (): string | undefined => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [accessToken, setAccessToken] = useState<string>();
    useEffect(() => {
        if (isAuthenticated) {
            const getAccessToken = async () => {
                const accessToken = await getAccessTokenSilently({
                    audience: `https://auth0-test-api.jbrunton-aws.com`,
                    scope: "openid profile email",
                });
                setAccessToken(accessToken);
            }
            getAccessToken();
        }
    }, [isAuthenticated]);
    return accessToken;
};
