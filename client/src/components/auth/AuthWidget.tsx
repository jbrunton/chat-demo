import { useAuth0 } from '@auth0/auth0-react'
import React, { useEffect, useState } from 'react'
import { useCustomGreeting, usePrivateGreeting } from '../../data/greetings'
import { LoginButton } from './LoginButton'
import { LogoutButton } from './LogoutButton'
import { Profile } from './Profile'

export const AuthWidget = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0()
  const [accessToken, setAccessToken] = useState<string>()
  useEffect(() => {
    if (isAuthenticated) {
      const getAccessToken = async () => {
        const accessToken = await getAccessTokenSilently({
          audience: `https://auth0-test-api.jbrunton-aws.com`,
          scope: 'openid profile email',
        })
        setAccessToken(accessToken)
      }
      getAccessToken()
    }
  }, [isAuthenticated])

  const { data: privateGreeting } = usePrivateGreeting(accessToken)
  const { mutate } = useCustomGreeting("Hey {0}, what's up?", accessToken)

  if (isLoading) {
    return <div>Loading ...</div>
  }

  if (!isAuthenticated) {
    return <LoginButton />
  }

  return (
    <>
      {user && <Profile user={user} />}
      {privateGreeting && (
        <div>
          private greeting: {privateGreeting}
          <button onClick={() => mutate()}>Custom Greeting</button>
        </div>
      )}
      <div>
        <LogoutButton />
      </div>
    </>
  )
}
