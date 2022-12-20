import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";
import { Profile } from "./Profile";

export const AuthWidget = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!isAuthenticated) {
    return <LoginButton />
  }

  return (
    <>
      {user && (<Profile user={user} />)}
      <LogoutButton />
    </>
  );

};
