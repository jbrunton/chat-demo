import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'

export const useAccessToken = (): { accessToken: string | undefined; isLoading: boolean } => {
  const { isAuthenticated, getAccessTokenSilently, isLoading: isLoadingAuth } = useAuth0()
  const [accessToken, setAccessToken] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoadingAuth) {
      return
    }

    if (isAuthenticated) {
      const getAccessToken = async () => {
        const accessToken = await getAccessTokenSilently({
          audience: `https://chat-demo-api.jbrunton-aws.com`,
          scope: 'openid profile email',
        })
        setAccessToken(accessToken)
        setIsLoading(false)
      }
      getAccessToken()
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, isLoading, isLoadingAuth])

  return { accessToken, isLoading }
}
