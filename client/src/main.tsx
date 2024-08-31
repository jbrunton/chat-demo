import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Auth0Provider } from '@auth0/auth0-react'
import { baseTheme, ChakraProvider, extendTheme, StyleFunctionProps } from '@chakra-ui/react'
import 'highlight.js/styles/default.css'
import './main.css'
import App from './App'
import { AuthProvider } from './features/auth/provider'
import { configureDefaults } from './data/config'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true,
      retry: 0,
    },
  },
})

configureDefaults()

const theme = extendTheme({
  colors: {
    primary: baseTheme.colors.blue,
  },
  components: {
    Button: {
      variants: {
        drawer: (props: StyleFunctionProps) => {
          const selectedProps = {
            bg: 'primary.50',
            color: 'primary.600',
          }
          return {
            ...theme.components.Button.variants.ghost(props),
            width: '100%',
            justifyContent: 'start',
            ...(props['aria-selected'] ? selectedProps : {}),
          }
        },
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Auth0Provider
      domain='jbrunton.eu.auth0.com'
      clientId='Nv4fV7kgzIIQ7LobQgZQpWQ6WOWinFLJ'
      audience='https://chat-demo-api.jbrunton-aws.com'
      scope='openid profile email'
      redirectUri={`${window.location.origin}/callback`}
      useRefreshTokens
      cacheLocation='localstorage'
    >
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <App />
          </ChakraProvider>
        </QueryClientProvider>
      </AuthProvider>
    </Auth0Provider>
  </React.StrictMode>,
)
