import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Auth0Provider } from '@auth0/auth0-react'
import { ChakraProvider } from '@chakra-ui/react'
import 'highlight.js/styles/default.css'
import './main.css'
import App from './App'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Auth0Provider
      domain='jbrunton.eu.auth0.com'
      clientId='Nv4fV7kgzIIQ7LobQgZQpWQ6WOWinFLJ'
      audience='https://auth0-test-api.jbrunton-aws.com'
      scope='openid profile email'
      redirectUri={window.location.origin}
    >
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </QueryClientProvider>
    </Auth0Provider>
  </React.StrictMode>,
)
