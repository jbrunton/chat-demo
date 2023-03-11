import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'

export const useAccessToken = (): { accessToken: string | undefined; isLoading: boolean } => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [accessToken, setAccessToken] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      const getAccessToken = async () => {
        const accessToken = await getAccessTokenSilently({
          audience: `https://auth0-test-api.jbrunton-aws.com`,
          scope: 'openid profile email',
        })
        setAccessToken(accessToken)
        setIsLoading(false)
      }
      getAccessToken()
    }
  }, [isAuthenticated, isLoading])

  return { accessToken, isLoading }
}
