import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { usePrivateGreeting } from "../../data/greetings";
import { LoginButton } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";
import { Profile } from "./Profile";

export const AuthWidget = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState<string>("");
  useEffect(() => {
    const getAccessToken = async () => {
      const accessToken = await getAccessTokenSilently({
        audience: `https://auth0-test-api.jbrunton-aws.com`,
        scope: "openid profile email",
      });
      setAccessToken(accessToken);
    }
    getAccessToken();
  }, []);
  const { data } = usePrivateGreeting(accessToken);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!isAuthenticated) {
    return <LoginButton />
  }

  return (
    <>
      {user && (<Profile user={user} />)}
      { data && (<span>private greeting: {data}</span>) }
      <LogoutButton />
    </>
  );

};
